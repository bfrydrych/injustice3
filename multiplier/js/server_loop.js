const {
     parentPort, workerData
  } = require('worker_threads');

var GameServer = require("./game_server.js");

var events = [];

parentPort.on('message', (msg) => {
  events.push(msg);
});

while (true) {
  setTimeout(function() {
    events.forEach((event) => {
      console.log("Processing " + event);
      GameServer.process(event);
    });
    GameServer.sendState();
  }, 100);
}