// const http = require('http')

import { Server } from "socket.io"
import http from "http"

let io:any;

export const initializeSocket = (app:any) => {
    const server = http.createServer(app);
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5000",
            methods: ["GET", "POST"],
        }
    });

    io.on('connection', (socket:any) => {
        console.log("new socket io connection...");

        // listen for the 'join event and join the room
        socket.on('join', (room:any) => {
            socket.join(room);
            console.log(`user joined room: ${room}`);
        });

        socket.on('disconnect', ()=> {
            console.log('user disconnected');
        });

        socket.on('message', ()=> {
            console.log('new message received')
        })
    });

    return server;
};


export const getIo =()=> {
    if(!io){
        throw new Error('socket is not initialized');
    }
    return io;
}

// module.exports = { initializeSocket, getIo };