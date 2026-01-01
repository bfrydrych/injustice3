class Client {
    socket;
    listeners = [];
    constructor() {
      
    }
  
    connect() {
        this.socket = io("http://localhost:8080");
        this.socket.connect();
        let self = this;
        this.socket.on('MESSAGES', function(message) {
            self.listeners.get(message.constructor.name)(message);
        });
    }

    sendJoin(playerName, characterType) {
        this.socket.emit('MESSAGES', new JoinMessage(playerName, characterType));
    }

    send(message) {
        this.socket.emit('MESSAGES', message);
    }


    on(channel, callback) {
        this.listeners.push({channel: channel, callback: callback});
    }
  }

