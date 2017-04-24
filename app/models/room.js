const mongoose = require('mongoose');

// ##### SCHEMA #####
const roomSchema = mongoose.Schema({
    name: String,
    created: Date,
    admin: String,
    users: Array,
});

module.exports = mongoose.model('Room', roomSchema);
