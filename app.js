require('dotenv').config();
const express = require('express');
const http = require('http');
const connectDB = require('./utils/mongodb'); 
const configureMiddleware = require('./config/middlewareConfig'); 
const configureSocket = require('./config/socketConfig'); 
const configureRoutes = require('./config/routesConfig'); 

const app = express();
const server = http.createServer(app);

configureMiddleware(app);

const io = configureSocket(server);

require('./socket/socketHandler')(io);

connectDB(process.env.MONGO_URI);

configureRoutes(app, io); 

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
