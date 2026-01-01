/*
var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
*/
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var {PlayerHandshakeMessage, Channels} = require("./common_net.js");

const {
    Worker, isMainThread, parentPort, workerData
  } = require('worker_threads');


export class Server {
    CHANNELS = Channels;
    sockets;
    io;
    constructor(io) {
        this.io = io;
        this.sockets = new Map();
    }

    start() {
        var self = this;
        const serverLoop = new Worker('./server_loop.js');
        this.io.on('connection',function(socket){
            console.log('client connecting')
            socket.on(PlayerHandshakeMessage.name, function(message) {
                self.sockets.set(message.playerName, socket);
            });
            socket.on(Channels.MESSAGES, function(message) {
                serverLoop.postMessage(message);
            });
            console.log("client connected")
        });
    }


    broadcast(message) {
        this.io.emit(Channels.MESSAGES, message);
    }

    send(player, message) {
        let socket = this.sockets.get(player.name);
        socket.emit(Channels.MESSAGES, message);
    }
}


