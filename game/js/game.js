let gameScene = new Phaser.Scene('Game');
// our game's configuration
let hunterPlayer = null
let config = {
  type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
  width: 1900, // game width
  height: 1800, // game height
  scene: gameScene // our newly created scene
};
// create the game, and pass it the configuration
let game = new Phaser.Game(config);

// load asset files for our game
gameScene.preload = function() {
  // load images
  this.load.atlas('hunter', 'assets/hunter/katana.png', 'assets/hunter/katana.json');
  //this.load.spritesheet("hunter", "assets/hunter/katana.png", { frameWidth: 512, frameHeight: 512 });
  this.load.path = 'assets/hunter/';
  this.load.image('hunter1', '1.jpg');

};
// executed once, after assets were loaded
gameScene.create = function() {
  // background
  //this.add.sprite(0, 0, 'hunter', 'background.png');
  // change origin to the top-left of the sprite
  //bg.setOrigin(0,0);

  //this.capguy = this.add.sprite(0, 400, 'hunter', 'assets/hunter/1..jpg');
  //this.capguy.setScale(0.5, 0.5);

  const frameNames = this.anims.generateFrameNames('hunter', {
    start: 1, end: 4, zeroPad: 1, suffix: ".jpg"
  });

  this.anims.create({ key: 'katana', frames: frameNames, frameRate: 2, repeat: -1 });
  this.hunterPlayer = this.physics.add.sprite(400, 300, 'hunter1')
  this.hunterPlayer.play('katana')

  /*
  this.anims.create({
    key: "slice",
    frameRate: 7,
    frames: this.anims.generateFrameNumbers("hunter", { start: 1, end: 4 }),
    repeat: -1
  });
  this.capguy.play(slice)
*/
};

gameScene.preload = function() {

  cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    this.hunter.setVelocityX(-160);
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

};