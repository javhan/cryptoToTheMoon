////////// Data \\\\\\\\\\
let platformCount = 7;
const platforms = [];
let isJumping = false;
let descent = 3;
let ascent = 5;
let startingPoints;
let score = 0;
let downTimer; // very important when it comes to resetting jumps
let upTimer; // very important when it comes to resetting jumps

//first page - Start Menu
const startMenu = () => {
  $playArea = $(".playArea").css({
    width: "400px",
    height: "600px",
    "background-color": "#191919",
    position: "relative",
    background:
      "url(https://cdn.statically.io/img/i.pinimg.com/originals/6c/10/41/6c104134a19348812711bc77d068e315.jpg)",
    "background-size": "cover"
  });

  $button = $(
    `<input type = button value="Start Game" id = "startGame">`
  );

  $playArea.append($button);

};

////////// Building the play area \\\\\\\\\\
const render = () => {
  // const $playArea = $(".playArea").css({
  //   width: "400px",
  //   height: "600px",
  //   "background-color": "#191919",
  //   position: "relative",
  //   background:
  //     "url(https://cdn.statically.io/img/i.pinimg.com/originals/6c/10/41/6c104134a19348812711bc77d068e315.jpg)",
  //   "background-size": "cover",
  // });

  const $rocket = $("<div>").addClass("rocket").css({
    width: "50px",
    height: "60px",
    "background-color": "#057DCD",
    position: "absolute",
    left: "200px",
    bottom: "200px",
    background: "url(assets/free-rocket.png)",
    "background-size": "cover",
  });

  const $highScore = $("<div>")
    .addClass("score")
    .text(`Highscore: ${score}`)
    .css({ color: "white", "background-color": "black", opacity: "0.5" });

  $(".playArea").append($highScore);
  $(".playArea").append($rocket);
};
////////// Rocket movements \\\\\\\\\\
const down = () => {
  if (!isJumping) {
    clearInterval(upTimer);
    let $rocketBottom = parseFloat($(".rocket").css("bottom"));
    let $rocketLeft = parseFloat($(".rocket").css("left"));
    let rocketNewLow = $rocketBottom - descent;
    $(".rocket").css("bottom", `${rocketNewLow}px`);
    for (const platform of platforms) {
      if (
        $rocketLeft >= parseFloat(platform.css("left")) - 50 &&
        $rocketLeft <= parseFloat(platform.css("left")) + 135 &&
        $rocketBottom >= parseFloat(platform.css("bottom")) &&
        $rocketBottom <= parseFloat(platform.css("bottom")) + 20
      ) {
        console.log("platform touched");
        isJumping = true;
        startingPoint = parseFloat($(".rocket").css("bottom"));
        upTimer = setInterval(up, 50, startingPoint); // need to sort this out causing the game to spazz
      }
    }
    if ($rocketBottom <= 0) {
      descent = 0;
      gameOver();
    }
  }
};

const up = (liftPoint) => {
  let $rocketBottom = parseFloat($(".rocket").css("bottom"));
  if (isJumping) {
    clearInterval(downTimer);
    let rocketHigh = $rocketBottom + ascent;
    $(".rocket").css("bottom", `${rocketHigh}px`);
  }
  if ($rocketBottom >= liftPoint + 100) {
    isJumping = false;
    startingPoint = -5;
    downTimer = setInterval(down, 30); //need to sort this out causing game to spazz
  }
};

const moveRocket = (event) => {
  let $rocketLeft = parseFloat($(".rocket").css("left"));
  if ($rocketLeft > 350) {
    console.log($rocketLeft);
    $rocketLeft = 0;
  } else if ($rocketLeft < 0) {
    $rocketLeft = 350;
  }
  switch (event.which) {
    case 37:
      let moveLeft = $rocketLeft - 10;
      $(".rocket").css("left", `${moveLeft}px`);
      break;
    case 39:
      let moveRight = $rocketLeft + 10;
      $(".rocket").css("left", `${moveRight}px`);
      break;
  }
};

////////// Platforms \\\\\\\\\\
const createPlatforms = () => {
  for (let i = 0; i < platformCount; i++) {
    let platformSpace = 600 / platformCount;
    let newPlatBottom = 100 + i * platformSpace;
    const $platform = $("<div>")
      .addClass("platform")
      .css({
        width: "85px",
        height: "15px",
        "background-color": "red",
        position: "absolute",
        left: `${Math.random() * 315}px`,
        bottom: `${newPlatBottom}px`,
        "font-size": "10px",
        "text-align": "center",
        background: "url(assets/platform.png)",
        "background-size": "contain",
      });
    $(".playArea").append($platform);
    platforms.push($platform);
  }
};

const newPlatform = (newPlatBottom) => {
  const $platform = $("<div>")
    .addClass("platform")
    .css({
      width: "85px",
      height: "15px",
      "background-color": "red",
      position: "absolute",
      left: `${Math.random() * 315}px`,
      bottom: `${newPlatBottom}px`,
      "font-size": "10px",
      "text-align": "center",
      background: "url(assets/platform.png)",
      "background-size": "contain",
    });
  score++;
  $(".score").text(`Highscore: ${score}`);
  platforms.push($platform);
  $(".playArea").append($platform);
};

const movePlatforms = () => {
  if (parseFloat($(".rocket").css("bottom")) > 150) {
    platforms.forEach((platform) => {
      let newBottom = parseFloat(platform.css("bottom")) - 3;
      platform.css("bottom", `${newBottom}` + `px`);
      if (parseFloat(platform.css("bottom")) < 3) {
        // platform disappears here
        platforms.shift();
        $(".playArea").find(".platform").first().remove();
        newPlatform(590);
      }
    });
  }
};

const gameOn = () => {
  $('#startGame').remove();
  render();
  createPlatforms($(".playArea"));
  $("body").keydown(moveRocket);
  setInterval(movePlatforms, 15);
  downTimer = setInterval(down, 30); // sort this out, causing game to spazz
};

const gameOver = () => {
  console.log("Game Over!");
  isJumping = true;
};

const main = () => {
  startMenu();
  $('#startGame').on("click", gameOn);
};

$(main);
