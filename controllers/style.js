import Style from '../models/style.js';
import slugify from '../middleware/slugify.js';

const buildAncestors = async (id, parent_id) => {
    let ancest = [];
    try {
        let parentCategory = await Style.findOne(
            { _id: parent_id },
            { name: 1, slug: 1, ancestors: 1 }
        ).exec();
        if (parentCategory) {
            const { _id, name, slug } = parentCategory;
            ancest = [...parentCategory.ancestors];
            ancest.unshift({ _id, name, slug });
            await Style.findByIdAndUpdate(id, {
                $set: { ancestors: ancest }
            });
        }
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
};

const buildHierarchyAncestors = async (categoryId, parentId) => {
    if (categoryId && parentId) {
        buildAncestors(categoryId, parentId);
        const result = await Style.find({ parent: categoryId });
    }
    if (result) {
        result.forEach((doc) => {
            buildHierarchyAncestors(doc._id, categoryId);
        });
    }
};

export const addStyle = async (name, parentId) => {
    let parent = parentId ? parentId : null;
    const category = new Style({ name: name, parent });
    try {
        let newCategory = await category.save();
        buildAncestors(newCategory._id, parent);
        return newCategory._id;
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
};

export const getStyle = async (slug) => {
    try {
        const result = await Style.find({ slug: slug }).select({
            _id: false,
            name: true,
            'ancestors.slug': true,
            'ancestors.name': true
        });
        return result;
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
};

export const getStyleDescendants = async (categoryId) => {
    try {
        const result = await Style.find({
            'ancestors._id': categoryId
        }).select({ _id: true, name: true });
        return result;
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
};

export const updateStyleParent = async (categoryId, newParentId) => {
    const category = await Style.findByIdAndUpdate(categoryId, {
        $set: { parent: newParentId }
    });
    buildHierarchyAncestors(category._id, newParentId);
};

export const renameStyle = async (categoryId, categoryName) => {
    Style.findByIdAndUpdate(categoryId, {
        $set: { name: categoryName, slug: slugify(categoryName) }
    });
    Style.update(
        { 'ancestors._id': categoryId },
        {
            $set: {
                'ancestors.$.name': categoryName,
                'ancestors.$.slug': slugify(categoryName)
            }
        },
        { multi: true }
    );
};

export const deleteStyle = async (categoryId) => {
    err = await Style.findByIdAndRemove(categoryId);
    if (!err) result = await Style.deleteMany({ 'ancestors._id': categoryId });
};
