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
const server = require('http').Server(app);
const io = require('socket.io')(server);

const configDB = require('./config/database.js');

// ######### CONFIGURATION ##########
mongoose.Promise = global.Promise; // ES6 PROMISE
mongoose.connect(configDB.url, (err) => {
    if (err) console.log(err);
});

// Enable https
require('./config/https.js')(app);

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

require('./app/socket.js')(io);

// Passport
app.use(session({secret: 'huzzaahComrades'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport')(passport);

// ########## ROUTER ############
require('./app/routes.js')(app, passport);
require('./app/api.js')(app);

// ########### LAUNCH ###########
server.listen(port, (err) => {
    if (err) console.log(err);
    console.log('App Server is listening port ', port);
});

// ####### SIGNAL SERVER ########

const appRtc = express();
const config = require('getconfig');
const webrtc = require('signal-master/sockets');

const signalServer = appRtc.listen(3000, (err) => {
    if (err) console.log(err);
    console.log('SignalServer (for webRTC) is listening port 3000');
});
webrtc(signalServer, config);

