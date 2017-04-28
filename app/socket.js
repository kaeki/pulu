module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected with session id: '+socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('message', (msg) => {
            io.to(msg.roomId).emit('message', msg);
        });
        socket.on('room', (room) => {
            socket.join(room, () => {
                console.log('User joined to room '+room);
            });
        });
    });
};
