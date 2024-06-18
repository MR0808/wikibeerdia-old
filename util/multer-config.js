import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const breweryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/breweries');
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.slice(6, file.mimetype.length);
        cb(null, uuidv4() + '.' + extension);
    }
});

const imageFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const breweryUploadHandler = multer({
    storage: breweryStorage,
    fileFilter: imageFilter
});
