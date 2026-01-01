class Channels {
    static PLAYER_HANDSHAKE = 'PLAYER_HANDSHAKE';
    static NEW_PLAYER_JOINED = 'new_player_joined';
    static ALL_PLAYERS = 'ALL_PLAYERS';
    static START_MOVE = 'START_MOVE';
    static MESSAGES = 'MESSAGES';                      
    
}

class Message {
    timestamp;
    playerReceipent;

    constructor() {
        this.timestamp = Date.now();
    }
}

class StartMove extends Message {
    playerName;
    direction;

    constructor(playerName, direction) {
        super();
        this.playerName = playerName;
        this.direction = direction;
    }
}

class PlayerNewPosition extends Message {
    playerName;
    x;
    constructor(playerName, x) {
        super();
        this.playerName = playerName;
        this.x = x;
    }
}

class AllPlayersMessage extends Message {
    players;
    constructor(players) {
        super();
        this.players = players;
    }
}

class JoinMessage extends Message {
    playerName;
    characterType;

    constructor(playerName, characterType) {
        super();
        this.playerName = playerName;
        this.characterType = characterType;
    }
}

class NewPlayerJoinedMessage extends Message {
    player;

    constructor(player) {
        super();
        this.player = player;
    }
}

class PlayerHandshakeMessage extends Message {
    playerName;

    constructor(playerName) {
        super();
        this.playerName = playerName;
    }
}

if (typeof module != "undefined") {
    module.exports = { Channels }
  }
  