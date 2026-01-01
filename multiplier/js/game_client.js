//onst { Katana } = require("./game_core");


class GameClient {
  client;
  players = [];
  playersMap = new Map();
  player;
  playerName;
  constructor(client) {
    this.client = client;
  }

  joinGame(name, characterType) {
    this.client.send(new JoinMessage(name, characterType));
  }

  addPlayer(player) {
    console.log("Player " + player + " joined");
    var cliPlayer = ClientPlayersFactory.createClientPlayer(player);
    this.players.push(cliPlayer);
    this.playersMap.set(cliPlayer.name, cliPlayer);
    if (player.name === this.playerName) {
      this.player = cliPlayer;
    }
    cliPlayer.idle()
  }

  startListening() {
    var self = this;
    this.client.on(NewPlayerJoinedMessage.name, function(message) {
      self.addPlayer(message.player);
    });
    this.client.on(AllPlayersMessage.name, function(message) {
      message.players.forEach(function(player) {
        if(!self.playersMap.has(player.name)) {
          self.addPlayer(player);
        }
      });
    });
    this.client.on(AllPlayersMessage.name, function(message) {
      message.players.forEach(function(player) {
        if(!self.playersMap.has(player.name)) {
          self.addPlayer(player);
        }
      });
    });

    this.client.connect();
  }
}

class ClientKatanaPlayer extends Player {
  constructor(player) {
    super(player.name, player.character)
    Object.assign(this, player);
    this.character = ClientPlayersFactory.createClientCharacter(player.character);
    this.character.createIdleState(this.x, this.y);
  }

  idle() {
    let stateIdle = this.character.states.get(CharacterState.idle);
    stateIdle.play();
  }
}

class CharacterState {
  static idle = 'idle'
  name;
  animation;
  constructor(stateName, character) {
    this.name = character.type + "-" + stateName;
  }

  play() {
    this.animation.play(this.name);
  }
}

class ClientKatanaCharacter extends Character {
  state;
  states;
  constructor(character) {
    super(character.type, character.height, character.width)
    this.states = new Map();
  }

  createIdleState(x, y) {
    this.state = new CharacterState(CharacterState.idle, this);
    const frameNames = GameScene.anims.generateFrameNames('fighter1', {
      start: 0, end: 7, zeroPad: 3, suffix: ".png", prefix: "muscular_muay_thai_fighter_1/animations/idle/east/idle_east_frame_"
    });
  
    GameScene.anims.create({ key:this.state.name, frames: frameNames, frameRate: 10, repeat: -1 });
    this.state.animation = GameScene.physics.add.sprite(x, y, 'fighter1');
    this.states.set(CharacterState.idle, this.state);
  }

  static loadAssets() {
    GameScene.load.atlas('fighter1', 'assets/fighter1/fighter1.png', 'assets/fighter1/fighter1.json');
    //this.load.spritesheet("hunter", "assets/hunter/katana.png", { frameWidth: 512, frameHeight: 512 });
    GameScene.load.path = 'assets/fighter1/';
    //GameScene.load.image('hunter1', '1.jpg');
  }
}

/*
class ClientKatanaCharacter extends Character {
  state;
  states;
  constructor(character) {
    super(character.type, character.height, character.width)
    this.states = new Map();
  }

  createIdleState(x, y) {
    this.state = new CharacterState(CharacterState.idle, this);
    const frameNames = GameScene.anims.generateFrameNames('hunter', {
      start: 1, end: 4, zeroPad: 1, suffix: ".jpg"
    });
  
    GameScene.anims.create({ key:this.state.name, frames: frameNames, frameRate: 2, repeat: -1 });
    this.state.animation = GameScene.physics.add.sprite(x, y, 'hunter1');
    this.states.set(CharacterState.idle, this.state);
  }

  static loadAssets() {
    GameScene.load.atlas('hunter', 'assets/hunter/katana.png', 'assets/hunter/katana.json');
    //this.load.spritesheet("hunter", "assets/hunter/katana.png", { frameWidth: 512, frameHeight: 512 });
    GameScene.load.path = 'assets/hunter/';
    GameScene.load.image('hunter1', '1.jpg');
  }
}
*/

class ClientPlayersFactory {
  static charactersTypes = ['katana']
  constructor() {
  }

  static createClientPlayer(player) {
    if (player.character.type === 'katana') {
      return new ClientKatanaPlayer(player);
    }
  }

  static createClientCharacter(character) {
    if (character.type === 'katana') {
      return new ClientKatanaCharacter(character);
    }
  }

  static getCharacterLoadAssets(type) {
    if (type === 'katana') {
      return ClientKatanaCharacter.loadAssets;
    }
  }

  static allCharactersLoadAsset() {
    let clientCharacters = ClientPlayersFactory.charactersTypes.map((type) => ClientPlayersFactory.getCharacterLoadAssets(type));
    return clientCharacters;
  }
}

var client = new Client();
var gameClient = new GameClient(client);
gameClient.startListening();




var GameScene = new Phaser.Scene('Game');
// our game's configuration
let hunterPlayer = null
let config = {
  type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
  width: 1900, // game width
  height: 1800, // game height
  scene: GameScene, // our newly created scene
  physics: {
    default: 'arcade'
},
};
// create the game, and pass it the configuration
let game = new Phaser.Game(config);


// executed once, after assets were loaded
GameScene.create = function() {
  // background
  //this.add.sprite(0, 0, 'hunter', 'background.png');
  // change origin to the top-left of the sprite
  //bg.setOrigin(0,0);

  //this.capguy = this.add.sprite(0, 400, 'hunter', 'assets/hunter/1..jpg');
  //this.capguy.setScale(0.5, 0.5);

  /*
  const frameNames = this.anims.generateFrameNames('hunter', {
    start: 1, end: 4, zeroPad: 1, suffix: ".jpg"
  });

  this.anims.create({ key: 'katana', frames: frameNames, frameRate: 2, repeat: -1 });
  this.hunterPlayer = this.physics.add.sprite(400, 300, 'hunter1')
  this.hunterPlayer.play('katana')
  */

  /*
  this.anims.create({
    key: "slice",
    frameRate: 7,
    frames: this.anims.generateFrameNumbers("hunter", { start: 1, end: 4 }),
    repeat: -1
  });
  this.capguy.play(slice)
*/
  client.send(new PlayerHandshakeMessage('Bart'));
  gameClient.joinGame('Bart', 'katana');
};

// load asset files for our game
GameScene.preload = function() {
  this.load.setBaseURL('http://localhost:8080');
  ClientPlayersFactory.allCharactersLoadAsset().forEach((loadAsset) => loadAsset());
  /*
  cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    this.player.character.setVelocityX(-160);
    hunter.setVelocityY(0);

  } else if (cursors.right.isDown) {
    hunter.setVelocityX(160);
    hunter.setVelocityY(0);
    
  } else if (cursors.up.isDown) {
    hunter.setVelocityX(0);
    hunter.setVelocityY(-160);
    
  } else if (cursors.down.isDown) {
    hunter.setVelocityX(0);
    hunter.setVelocityY(160);
    
  } else {
    this.hunter.setVelocityX(0);
    hunter.setVelocityY(0);
  }
  */

};