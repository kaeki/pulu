const User = require('./models/user');
const Room = require('./models/room');
const ObjectId = require('mongodb').ObjectID;

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
            online: req.user.online,
        };
        res.send(JSON.stringify(user));
    });

    // ########## ROOM ###############
    // Create new room
    app.post('/api/createroom/:name', isLoggedIn, (req, res) => {
        const newRoom = {
            name: req.params.name,
            created: Date.now(),
            admin: req.user._id,
            users: [
                {_id: req.user._id, username: req.user.username},
            ],
        };
        Room.create(newRoom).then((room) => {
            User.findOne({_id: req.user._id}, (err, user) => {
                console.log(user);
                console.log(room);
                user.rooms.push({_id: room._id, name: room.name, admin: true});
                user.save((err) => {
                    if (err) {
                        console.log(err);
                        res.send({status: 'error', message: 'Error adding room'});
                    }
                    res.send({status: 'OK', room: room});
                });
            });
        }).catch((err) => {
            res.send({status: 'error', message: 'Error creating room'});
        });
    });
    // Add existing room for user
    app.post('/api/addroom/:id', isLoggedIn, (req, res) => {
        User.findOne({_id: req.user._id}, (err, user) => {
            if (err) {
                res.send({status: 'error', message: 'User not found'});
            }
            Room.findOne({_id: req.params.id}, (err, room) => {
                if (err) {
                    res.send({status: 'error', message: 'No rooms found with given id.'});
                }
                room.users.push({_id: user._id, username: user.username});
                room.save((err) => {
                    if (err) {
                        throw err;
                    }
                });
                user.rooms.push({_id: room._id, name: room.name, admin: false});
                user.save((err) => {
                    if(err) {
                        throw err;
                    }
                });
                res.send({status: 'OK', message: 'Room added'});
            });
        });
    });
    // ########## GET ALL USERS ONLINE IN ROOM ##########
    app.get('/api/roomusers/:id', isLoggedIn, (req, res) => {
        User.find({rooms: {$elemMatch: {_id: ObjectId(req.params.id)}}}, 
        {username: 1, online: 1},
        (err, users) => {
            if(err) res.send({status: 'error', message: 'No users found'});
            res.send({status: 'OK', users: users});
        });
    });
};
