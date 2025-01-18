const { Server } = require('socket.io');

const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*', 
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        },
    });

    return io;
};

module.exports = configureSocket;
