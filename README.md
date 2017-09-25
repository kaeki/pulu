# Pulu

Chat application with video chat made using Node.js, Socket.io and WebRTC.

## Requirements 
* MongoDB 3.** ->
* Node.js 7.0 ->
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

