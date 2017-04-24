const LocalStrategy = require('passport-local').Strategy;

// usermodel
const User = require('../app/models/user');

module.exports = (passport) => {
    // serialize and deserialize
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
       User.findById(id, (err, user) => {
           done(err, user);
       });
    });

    // ###### SIGN UP #######
    passport.use('signup', new LocalStrategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            User.findOne({'username': username}, (err, user) => {
                if (err) {
                    return done(err);
                }
                // if user already exists
                if (user) {
                    return done(null, false, req.flash('message', 'Username already taken.'));
                } else {
                    // create new user
                    console.log('Creating user', username);
                    const newUser = new User();

                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.created = Date.now();
                    newUser.friends = [];
                    newUser.rooms = [];

                    newUser.save((err) => {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        }
    ));
    // ###### LOGIN #######
    passport.use('login', new LocalStrategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            User.findOne({'username': username}, (err, user) => {
                if (err) return done(err);

                if (!user) {
                    return done(null, false, req.flash('message',
                    'No users found with that name'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('message',
                    'Wrong password. You shall not pass!'));
                }
                console.log(username, 'LOGGED IN');
                // All good, pass user through
                done(null, user);
            });
        }
    ));
};
