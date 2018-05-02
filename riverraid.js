function JetFighter(x, y) {
  this.position;
  this.direction;

  this.init = function() {
    this.position = createVector(x, y);
    this.direction = createVector(0, 0);
  }
  this.init();

  this.move = function() {
    this.position.add(this.direction);
  }

  this.draw = function() {
    let x = this.position.x;
    let y = this.position.y;
    let coord =
      this.direction.x < 0 ? sprites.coords["jetfighter-left"] :
      this.direction.x > 0 ? sprites.coords["jetfighter-right"] :
      sprites.coords["jetfighter"];
    image(sprites.spritesheet, x, y, coord[2], coord[3], coord[0], coord[1], coord[2], coord[3]);
  }
}
var jetFighter;

var sprites = {
  spritesheet: null,
  coords: {
    "jetfighter": [0, 0, 14, 12],
    "jetfighter-left": [14, 0, 14, 12],
    "jetfighter-right": [28, 0, 14, 12]
  }
};

function preload() {
  sprites.spritesheet = loadImage("spritesheet.png");
  jetFighter = new JetFighter(160, 180);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
  noSmooth();
}

function draw() {
  scale(3);
  background('black');

  noStroke();
  fill(134, 122, 222);
  rect(0, 0, 320, 200);

  jetFighter.move();
  jetFighter.draw();
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) jetFighter.direction.x = -1;
  if (keyCode == RIGHT_ARROW) jetFighter.direction.x = 1;
  if (keyCode == UP_ARROW) jetFighter.direction.y = -1;
  if (keyCode == DOWN_ARROW) jetFighter.direction.y = 1;
}

function keyReleased() {
  if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) jetFighter.direction.x = 0;
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) jetFighter.direction.y = 0;
}
