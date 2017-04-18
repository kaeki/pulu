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
    // app.post('/login', (req, res) => {});
    
    // #### SIGNUP ####
    app.get('/signup', (req, res) => {
        res.render('signup.pug', {message: req.flash('signupMessage')});
    });
    // app.post('/signup', (req, res) => {});

    // ##### APP ######
    app.get('/app', isLoggedIn, (req, res) => {
        res.render('app.pug', {
            user: req.user
        });
    });
    // #### LOGOUT ####
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}
