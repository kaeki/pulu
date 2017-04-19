const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// ##### SCHEMA #####
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    friends: Array,
});

// #### HASH PASSWORD ####
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// validate password
userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
