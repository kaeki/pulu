# Pulu

Chat application with video chat made using Node.js, WebRTC

## Example

[Example page](http://attesal-project.jelastic.metropolia.fi/)

## Install

Run  
`npm install`

Pulu uses MongoDB for users and rooms and database connection create a 
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

