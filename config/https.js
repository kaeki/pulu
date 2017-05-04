const config = require('./config');

module.exports = (app) => {
    if (!config.dev) {
        app.enable('trust proxy');
        app.use((req, res, next) => {
            if (req.secure) {
                next();
            } else {
                res.redirect('https://' + req.headers.host + req.url);
            }
        });
    }
};
