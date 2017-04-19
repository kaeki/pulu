// ############ SETUP #############
const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');

// ######### CONFIGURATION ##########
mongoose.connect(configDB.url, (err) => {
    if (err) console.log(err);
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Passport
app.use(session({secret: 'huzzaahComrades'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport')(passport);
// ########## ROUTER ############
require('./app/routes.js')(app, passport);

// ########### LAUNCH ###########
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log('Server is listening port ', port);
});

