// Config for database
const db = require('./config');

module.exports = {
    url: 'mongodb://'+db.user+':'+db.pwd+'@'+db.addr+':'+db.port+'/'+db.db,
};
