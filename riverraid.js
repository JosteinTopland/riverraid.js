/*
  River Raid JS
  jostein.topland@gmail.com
*/

let jetFighter;
let mountains = [];
let hitAreaLeft = [];
let hitAreaRight = [];
let restartTimer = 0;
let hiscore = 0;

function JetFighter(x, y) {
  this.location;
  this.direction;
  this.speed;
  this.toSpeed;
  this.engineSound = new p5.LowPass();
  this.crashSound;
  this.hitArea;
  this.crashed;

  this.init = function() {
    this.location = createVector(160, 0);
    this.direction = 0;
    this.speed = 0.2;
    this.speedTo = 0.5;
    this.crashed = false;

    this.hitArea = [
      createVector(6, 0),
      createVector(0, 5),
      createVector(0, 11),
      createVector(14, 11),
      createVector(14, 5),
      createVector(8, 0)
    ];

    this.crashSound = sounds["explosion"];

    let noise1 = new p5.Noise('white');
    let noise2 = new p5.Noise('brown');
    noise1.amp(0.1);
    noise2.amp(0.1);
    noise1.start();
    noise2.start();
    noise1.disconnect();
    noise2.disconnect();

    let dist = new p5.Distortion(0.1);
    dist.disconnect();
    noise1.connect(dist);
    noise2.connect(dist);
    dist.connect(this.engineSound);
  }
  this.init();

  this.move = function() {
    if (this.crashed) {
      this.direction = 0;
      this.speedTo = 0;
    }

    this.location.add(this.direction, 2 * this.speed);
    this.speed += (this.speedTo - this.speed) * 0.08;

    if (this.crashed) return;

    let ha = [];
    for (let i in this.hitArea) {
      ha[i] = createVector(this.location.x , 180).add(this.hitArea[i]);
    }
    if (collidePolyPoly(ha, hitAreaLeft) || collidePolyPoly(ha, hitAreaRight)) {
      this.crashed = true;
      this.crashSound.play();
    }
  }

  this.draw = function() {
    this.engineSound.set(this.speed * 1000 + 500, 2);
    if (this.crashed) return;
    let x = this.location.x;
    let y = 180;
    let coord =
      this.direction < 0 ? sprites.coords["jetfighter-left"] :
      this.direction > 0 ? sprites.coords["jetfighter-right"] :
      sprites.coords["jetfighter"];
    image(sprites.spritesheet, x, y, coord[2], coord[3], coord[0], coord[1], coord[2], coord[3]);
  }
}

var sprites = {
  spritesheet: null,
  coords: {
    "jetfighter": [0, 0, 14, 12],
    "jetfighter-left": [14, 0, 14, 12],
    "jetfighter-right": [28, 0, 14, 12],
    "mountain1": [0, 20, 47, 13],
    "mountain2": [0, 34, 65, 21],
    "mountain3": [0, 56, 77, 29]
  }
};

let sounds = {
  "explosion": null
}

function preload() {
  sprites.spritesheet = loadImage("spritesheet.png");
  sounds["explosion"] = loadSound("explosion.ogg");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
  noSmooth();
  noiseDetail(3, 0.4);
  jetFighter = new JetFighter();
  restart();
}

function draw() {
  scale(3);
  background('black');

  drawTerrain();

  jetFighter.move();
  jetFighter.draw();

  if (jetFighter.crashed) {
    if (restartTimer == 0) {
      restartTimer = Date.now() + 2000;
    } else if (restartTimer < Date.now()) {
      restart();
    }
  }

  let score = floor(jetFighter.location.y + jetFighter.speed * 0.1);
  if (score > hiscore) hiscore = score;

  stroke('gray');
  fill('white');
  strokeWeight(1);
  textFont('Courier New');
  textSize(8);
  text('SCORE: ' + score, 2, 208);
  text('HI-SCORE: ' + hiscore, 240, 208);
}

function restart() {
  jetFighter.crashed = false;
  jetFighter.location = createVector(160, 0);
  restartTimer = 0;

  noiseSeed(0);
  randomSeed(0);

  for (let i = 0; i < 3; i++) {
    let mountain = mountains[i];
    mountain = {};
    mountain.y = 200 * random();
    mountain.x = random() < 0.5 ? 0 : 250;
    mountain.spriteId = random() < 0.5 ? "mountain1" : random() < 0.5 ? "mountain2" : "mountain3";
    mountains[i] = mountain;
  }
}

function drawTerrain() {
  noStroke();
  fill(114, 177, 75);
  rect(0, 0, 320, 200);

  hitAreaLeft = [
    createVector(0, 200),
    createVector(0, 150)
  ];
  hitAreaRight = [
    createVector(320, 200),
    createVector(320, 150)
  ];
  for (let y = 0; y < 200; y++) {
    let t = 0.05 * (jetFighter.location.y - y);
    let r = min(120, jetFighter.location.y * 0.01 + 50);
    let x1 = noise(t) * r + 80;
    let x2 = noise(t + 30) * -r + 250;

    strokeWeight(1);
    stroke(132, 197, 204);
    line(x1 - 2, y, x2 + 2, y);
    stroke(134, 122, 222);
    line(x1 + 2, y, x2 - 2, y);

    if (y > 150 && y % 6 == 0) {
      hitAreaLeft.push(createVector(x1, y));
      hitAreaRight.push(createVector(x2, y));
    }
  }

  for (let i = 0; i < 3; i++) {
    let mountain = mountains[i];
    if (mountain.y > 200) {
      mountain.x = random() < 0.5 ? 0 : 250;
      mountain.y = -50;
      mountain.spriteId = random() < 0.5 ? "mountain1" : random() < 0.5 ? "mountain2" : "mountain3";
    }
    mountain.y += 2 * jetFighter.speed;
    let x = mountain.x;
    let y = mountain.y;
    let coord = sprites.coords[mountain.spriteId];
    image(sprites.spritesheet, x, y, coord[2], coord[3], coord[0], coord[1], coord[2], coord[3]);
    mountains[i] = mountain;
  }

  noStroke();
  fill('black');
  rect(0, 200, 320, 50);
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) jetFighter.direction = -1;
  if (keyCode == RIGHT_ARROW) jetFighter.direction = 1;
  if (keyCode == UP_ARROW) jetFighter.speedTo = 1.5;
  if (keyCode == DOWN_ARROW) jetFighter.speedTo = 0.1;
}

function keyReleased() {
  if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) jetFighter.direction = 0;
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) jetFighter.speedTo = 0.5;
}
