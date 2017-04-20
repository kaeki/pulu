const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// ##### SCHEMA #####
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    friends: Array,
    rooms: Array,
});

// #### HASH PASSWORD ####
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// validate password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
