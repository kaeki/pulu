const User = require('./models/user');
const Room = require('./models/room');

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

module.exports = (app) => {
    // ########## USER ##############
    // Get user info for client
    app.get('/api/user', isLoggedIn, (req, res) => {
        const user = {
            name: req.user.username,
            rooms: req.user.rooms,
            friends: req.user.friends,
        };
        res.send(JSON.stringify(user));
    });

    // ########## ROOM ###############
    // Create new room
    app.post('/newroom/:name', isLoggedIn, (req, res) => {
        const newRoom = {
            name: req.params.name,
            admin: req.user._id,
            users: [
                {_id: req.user._id, username: req.user.username},
            ],
        };
        Room.create(newRoom).then((room) => {
                res.send({status: 'OK', room: room});
            }).then(() => {
                res.send({status: 'error', message: 'Error when adding room'});
            });
    });
    // Add existing room for user
    app.post('/addRoom/:id', isLoggedIn, (req, res) => {
        User.find({_id: req.user._id}, (err, user) => {
            if (err) {
                res.send('No users found with given id');
            }
            Room.find({_id: req.params.id}, (err, room) => {
                if (err) {
                    res.send('No rooms found with given id');
                }
                room.users.push({_id: user._id, username: user.username});
                room.save((err) => {
                    if (err) {
                        throw err;
                    }
                });
                user.rooms.push({_id: room._id, name: room.name});
                user.save((err) => {
                    if(err) {
                        throw err;
                    }
                });
                res.send({status: 'OK', message: 'Room added'});
            });
        });
    });
};