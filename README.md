# Pulu
![Logo](https://github.com/kaeki/pulu/blob/master/public/img/logo-big.png?raw=true "logo")
Chat application with video chat made using Node.js, Socket.io and WebRTC.

## Install

Run  
`npm install`

Pulu uses MongoDB for users and rooms and for database connection create a 
file named config.js to config folder
```javascript
//  config.js
module.exports = {
    user: 'userName',
    pwd: 'password',
    addr: 'addressToDatabase',
    port: 'port',
    db: 'databaseName',
};
``` 

## Run

To start server

`npm start`

