class GameServer {
    BORDER_START = 0;
    BORDER_END = 680;
    server;
    players;
    eventsToSend;
    constructor(server) {
        this.players =  new Map();
        this.server = server;
        this.eventsToSend = [];
    }

    addPlayer(name, characterType) {
        let character;
        if (characterType === 'katana') {
            character = new Katana();
        }
        var player = new Player(name, character);
        let playersList = asList(this.players);
        if (this.players.isEmpty()) {
            player.x = 100;
        } else {
            player.x = playersList.last().x + playersList.last().getWidth() + 10;
        }
        this.players.set(name, player);
        return player;
    }

    startMove(player, direction) {
        var newPos = player.speed * direction + player.x;
        var collidedWithPlayer = this.checkCollideWithPlayers(player.x, newPos);
        var collideWithBorder = this.checkCollideWithBorder(newPos);
        if (!(collideWithBorder || collidedWithPlayer)) {
            player.x = newPos;
        }
    }

    checkCollideWithPlayers(pos, newPos) {
        if (pos > newPos) {
            return asList(this.players).some((player) => newPos > player.x === 0);
        }
        return false;
    }

    checkCollideWithBorder(newPos) {
        return newPos < this.BORDER_START || newPos > this.BORDER_END;
    }

    process(event) {
        if (event instanceof StartMove) {
            let player = this.players.get(event.playerName);
            this.startMove(player, event.direction);
            this.eventsToSend.push(new PlayerNewPosition(event.playerName, player.x));
        } else if (event instanceof NewPlayerJoinedMessage) {
            console.log(`player ${event.playerName} joined`);
            let player = self.addPlayer(joinedMessage.playerName, joinedMessage.characterType);
            let allPlayersMessage = new AllPlayersMessage(this.players);
            allPlayersMessage.playerReceipent = player;
            this.eventsToSend.push(allPlayersMessage);
            this.eventsToSend.push(new NewPlayerJoinedMessage(player));
        }
    }

    sendState() {
        this.eventsToSend.forEach((event) => {
            if (event.playerReceipent != null) {
                console.log("Sending event " + event);
                this.server.send(event.playerReceipent, event)
            } else {
                console.log("Broadcasting event " + event);
                this.server.broadcast(event);
            }
          });
    }

    startListening() {
        console.log("starting game server");
        server.start();
    }
}

function asList(map) {
    return Array.from(map.values());
}

Array.prototype.last = function() {
    return this[this.length - 1];
  }
  
  Array.prototype.isEmpty = function() {
    return this.length === 0;
  }

var express = require('express');
var cors = require('cors')
var app = express()
app.use(cors())

app.use('/js',express.static('js'));
app.use('/assets',express.static('assets'));

var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
server.listen(8080, () => {
    console.log('listening');
  });

const {Player, Character, Katana} = require( "./game_core.js" );
var Server = require("./server_net.js");
const {
    Channels, 
    StartMove, 
    PlayerNewPosition, 
    NewPlayerJoinedMessage, 
    AllPlayersMessage
} = require("./common_net.js");

var server = new Server.Server(io);
var gameServer = new GameServer(server);
gameServer.startListening();

