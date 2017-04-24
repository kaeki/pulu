const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};


module.exports = (app, passport) => {
    // ##### HOME #####
    app.get('/', (req, res) => {
        res.render('index.ejs', {message: req.flash('message')});
    });
    app.post('/login', passport.authenticate('login', {
        successRedirect: '/app',
        failureRedirect: '/',
        failureFlash: true,
    }));
    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/app',
        failureRedirect: '/',
        failureFlash: true,
    }));

    // ##### APP ######
    app.get('/app', isLoggedIn, (req, res) => {
        res.render('app.ejs', {
            user: req.user,
        });
    });
    // #### LOGOUT ####
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};
