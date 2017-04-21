module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected with session id: '+socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('message', (msg) => {
            console.log('message from client: '+JSON.stringify(msg));
            console.log(socket.rooms[Object.keys(socket.rooms)[0]]);
            io.in(socket.rooms[Object.keys(socket.rooms)[0]])
                .emit('message', msg);
        });
        socket.on('room', (room) => {
            if (socket.rooms) socket.leaveAll();
            socket.join(room, () => {
                console.log('Joined to room '+room);
            });
        });
    });
};
