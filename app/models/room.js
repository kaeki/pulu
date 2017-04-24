const mongoose = require('mongoose');

// ##### SCHEMA #####
const roomSchema = mongoose.Schema({
    name: String,
    created: Number,
});

module.exports = mongoose.model('Room', roomSchema);
