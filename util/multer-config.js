import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const imageFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        req.isFileValid = true;
        cb(null, true);
    } else {
        req.isFileValid = false;
        cb(null, false);
    }
};

const breweryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/breweries');
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.slice(6, file.mimetype.length);
        cb(null, uuidv4() + '.' + extension);
    }
});

const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/users');
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.slice(6, file.mimetype.length);
        cb(null, uuidv4() + '.' + extension);
    }
});

export const breweryUploadHandler = multer({
    storage: breweryStorage,
    fileFilter: imageFilter
});

export const userUploadHandler = multer({
    storage: userStorage,
    fileFilter: imageFilter
});
