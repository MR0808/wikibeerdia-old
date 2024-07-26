const isAuth = (req, res, next, access) => {
    if (!req.session.isLoggedIn && access === 'admin') {
        return res.redirect('/admin/login');
    }
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    if (access === 'verified' && !req.session.user.isVerified) {
        return res.redirect('/?notVerified=true');
    }
    if (access === 'admin' && req.session.user.access !== 'Admin') {
        return res.redirect('/');
    }

    next();
};

export default isAuth;
