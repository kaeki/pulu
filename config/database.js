// Config for database
const db = {
    user: 'mongomies',
    pwd: 'mongomiehenkostoonhirveä',
    addr: 'localhost',
    port: '27017',
    db: 'project',
};

module.exports = {
    url: 'mongodb://'+db.user+':'+db.pwd+'@'+db.addr+':'+db.port+'/'+db.db,
};
