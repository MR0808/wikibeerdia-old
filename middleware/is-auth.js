const isAuth = (req, res, next, access) => {
    if (access === 'verified' && !req.session.user.isVerified) {
        return res.redirect('/?notVerified=true');
    }
    if (access === 'admin' && req.session.user.access !== 'Admin') {
        return res.redirect('/');
    }
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
};

export default isAuth;
