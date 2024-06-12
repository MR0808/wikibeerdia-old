export const get404 = (req, res, next) => {
    res.status(404).render('404');
};

export const get500 = (req, res, next) => {
    res.status(500).render('500');
};
