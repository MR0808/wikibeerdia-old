export const getIndex = (req, res, next) => {
    res.render('main/index', {
        pageTitle: 'The online beer encyclopedia',
        path: '/'
    });
};
