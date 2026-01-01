class Player {
  character;
  constructor(name, character) {
    this.character = character
    this.name = name;
    this.x = 0;
    this.y = character.height;
  }

  getHeight() {
    return this.character.height
  }

  getWidth() {
    return this.character.width
  }
}

class Character {
  type;
  height;
  width;
  speed;

  constructor(type, height, width, speed) {
    this.type = type;
    this.height = height;
    this.width = width;
    this.speed = speed;
  }
}

class Katana extends Character {
  constructor() {
    super('katana', 160, 160, 5);
  }
}

if (typeof module != "undefined") {
  module.exports = { Player, Character, Katana }
}
