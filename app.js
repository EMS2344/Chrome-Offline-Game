//board (using this to reference our canvas tag)
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino (using this to reference our dino)
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//cactus (using this to reference our cactus)
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//Game physics
let velocityX = -8; //speed cactus is moving at going left
let velocityY = 0; //cactus always stays on the ground
let gravity = 0.4;

let gameOver = false;
let score = 0;

let dinoDuckImg;
let isDucking = false; // Track if the dino is ducking

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //we are using this to draw on our board
  dinoImg = new Image();
  dinoImg.src = "./img/dino.png";

  dinoDuckImg = new Image();
  dinoDuckImg.src = "./img/dino-duck1.png";

  dinoImg.onload = function () {
    // The onload event ensures that the image is fully loaded before you try to draw it on the canvas.
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  cactus1Img = new Image();
  cactus1Img.src = "./img/big-cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./img/big-cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./img/big-cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 millisecond = 1 so every second we are going to generate a random cactus from our three options
  document.addEventListener("keydown", moveDino); //whenever we press on a space or up arrow key we want the dino to move also we use keydown bcs it is used for detecting when a key is pressed and held down which is what we wanna look out for
  document.addEventListener("keyup", stopDucking); // This listens for when the "down arrow" key is released (keyup event).
  // When the key is released, it calls the stopDucking function, which will switch the dino back to its standing position.
};

function update() {
  if (gameOver) {
    //if the game is over no need to draw images anymore
    return;
  }
  requestAnimationFrame(update); // every frame will draw our img over and over again bcs we need to always change our y which is when we jump
  context.clearRect(0, 0, board.width, board.height);
  //dino img
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY); //applying gravity to current dino.y so it doesnt exceed our x aka ground
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  if (isDucking) {
    context.drawImage(dinoDuckImg, dinodino.x, dino.y, dino.width, dino.height);
  } else context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  //cactus img
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX; //he line cactus.x += velocityX; is updating the cactus's horizontal position by adding the value of velocityX to its current x position, causing it to move on the canvas.
    context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
    if (detectCollision(dino, cactus)) {
      gameOver = true;
      dinoImg.src = "./img/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }

  //score counter
  context.fillStyle = "white";
  context.font = "20px courier";
  score++;
  context.fillText(score, 5, 20);
}

function moveDino(e) {
  // e for event
  if (gameOver) {
    //if the game is over user can not jump
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    //In this context, dino.y represents the current vertical position of the dino, while dinoY
    // represents the ground level position (where the dino stands), and the condition checks if the dino is on the ground before allowing a jump when the Space or ArrowUp key is pressed.
    velocityY = -10;
  } else if (e.code == "ArrowDown" && dino.y == dinoY) {
    //logic for ducking
    dinoImg = dinoDuckImg; //so if user presses arrow down and the dino is touching the floor then it will switch to ducking img
  }
}

function stopDucking(e) {
  if (e.code == "ArrowDown") {
    // When the down arrow key is released, switch back to standing img
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
  }
}

function placeCactus() {
  if (gameOver) {
    //if the game is over no need to place cactus
    return;
  }
  //place cactus
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };
  let placeCactusChance = Math.random(); //gives you a number between 0 - 0.9999

  if (placeCactusChance > 0.9) {
    // we have now a 10% chance of drawing cactus 3 during our game
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    // we have now a 30% chance of drawing cactus 2 during our game
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //we have now a 50% chance of drawing cactus 1 during our game
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift(); //we remove the first element from the array so that the array doesnt constantly grow
  } //The phrase "constantly grow" in this context means that if you keep adding new cactuses to the cactusArray without removing any, the array
  // will keep increasing in size indefinitely. This can eventually lead to performance issues, as more
  //memory will be used to store the growing number of cactuses.
}

function detectCollision(a, b) {
  // we do a and b bcs its two objects the dino and our cactus

  return (
    a.x < b.x + b.width && // This checks if the left side of object 'a' (dino) is to the left of the right side of object 'b' (cactus)
    a.x + a.width > b.x && //This checks if the right side of object 'a' (dino) is to the right of the left side of object 'b' (cactus).
    a.y < b.y + b.height && //This checks if the top side of object 'a' (dino) is above the bottom side of object 'b' (cactus).
    a.y + a.height > b.y //This checks if the bottom side of object 'a' (dino) is below the top side of object 'b' (cactus).
  );
}

$(".change").on("click", function () {
  if ($("body").hasClass("dark")) {
    $("body").removeClass("dark");
    $(".change").text("OFF");
  } else {
    $("body").addClass("dark");
    $(".change").text("ON");
  }
});
