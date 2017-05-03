const mongoose = require('mongoose');

// ##### SCHEMA #####
const roomSchema = mongoose.Schema({
    name: String,
    created: Date,
    admin: String,
});

module.exports = mongoose.model('Room', roomSchema);
