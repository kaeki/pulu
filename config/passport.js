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
    passport.use('local-signup', new LocalStrategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            console.log('SIGNUP', username);
            User.findOne({'name': username}, (err, user) => {
                if (err) {
                    return done(err);
                }
                // if user already exists
                if (user) {
                    return done(null, false, req.flash('signUpMessage', 'Username already taken.'));
                } else {
                    // create new user
                    console.log('Creating user', username);
                    const newUser = new User();

                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.friends = [];

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
};
