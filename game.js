import kaboom from "kaboom";

kaboom();

const GRAVITY = 800;
const FLAP_FORCE = 320;
const PIPE_SPEED = 120;
const PIPE_GAP = 100;

const bird = add([
  rect(30, 20),
  pos(80, height() / 2),
  color(1, 1, 0),
  body(),
  origin("center"),
]);

const scoreLabel = add([
  text("0", 24),
  pos(12, 12),
  layer("ui"),
  {
    value: 0,
  },
]);

const pipes = [];

function spawnPipe() {
  const yPos = rand(80, height() - 80 - PIPE_GAP);
  const topPipe = add([
    rect(80, height()),
    pos(width(), yPos - PIPE_GAP / 2),
    color(0, 1, 0),
    origin("center"),
    "pipe",
  ]);
  const bottomPipe = add([
    rect(80, height()),
    pos(topPipe.pos.x, yPos + PIPE_GAP / 2),
    color(0, 1, 0),
    origin("center"),
    "pipe",
  ]);
  pipes.push(topPipe);
  pipes.push(bottomPipe);
}

function flap() {
  bird.jump(FLAP_FORCE);
}

function gameOver() {
  // Add game over logic here
}

action("pipe", (pipe) => {
  pipe.move(-PIPE_SPEED, 0);
  if (pipe.pos.x + pipe.width < 0) {
    destroy(pipe);
  }
});

bird.collides("pipe", gameOver);

loop(0.01, () => {
  bird.move(0, GRAVITY * dt());

  if (bird.pos.y >= height()) {
    gameOver();
  }

  if (bird.pos.y <= 0) {
    bird.pos.y = 0;
  }

  if (bird.isJumping()) {
    bird.use(shape("bird-flap"));
  } else {
    bird.use(shape("bird"));
  }

  while (pipes.length > 0 && pipes[0].pos.x + pipes[0].width < bird.pos.x) {
    destroy(pipes.shift());
    destroy(pipes.shift());
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  }
});

keyPress("space", flap);

spawnPipe();
every(2, spawnPipe);
