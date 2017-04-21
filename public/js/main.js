/*
const socket = io.connect('http://localhost:3000');

function sidebarClick (evt) {
    const channel = evt.target.innerText;
    document.querySelector('#chat-title').innerText = channel;
    document.querySelector('#messages').innerHTML = '';
    socket.emit('room', channel);
};

document.querySelectorAll('tr').forEach( item => {
    item.addEventListener('click', sidebarClick );
});

socket.on('message', (msg) => {
    const messages = document.querySelector('#messages');
    const timeStamp = new Date(msg.time).toLocaleTimeString('FI');
    const newMessage = `<div class="card><div class="card-block><p>${timeStamp} - <strong>${msg.user}:</strong> ${msg.text}</p></div></div>`;
    messages.innerHTML += newMessage;
});
socket.on('connect', () => {
    console.log('socket.io connected');
});
socket.on('disconnect', () => {
    console.log('socket.io disconnected');
});

function sendMsg(user, message) {
    console.log('send message');
    const msg = {};
    msg.app_id = this.appName;
    msg.time = Date.now();
    msg.user = user;
    msg.text = message;
    msg.json = 'json';
    socket.emit('message', msg);
};

document.querySelector('#sendMessageForm').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const userName = document.querySelector('#userName').value;
    const message = document.querySelector('#newMessage').value;
    sendMsg(userName, message);
    evt.target.reset();
});
*/