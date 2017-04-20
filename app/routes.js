const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

const express = require('express');

module.exports = (app, passport) => {
    app.use(express.static('public'));
    // ##### HOME #####
    app.get('/', (req, res) => {
        res.render('index.ejs', {message: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('login', {
        successRedirect: '/app',
        failureRedirect: '/',
        failureFlash: true,
    }));

    // #### SIGNUP ####
    app.get('/signup', (req, res) => {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/app',
        failureRedirect: '/signup',
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
