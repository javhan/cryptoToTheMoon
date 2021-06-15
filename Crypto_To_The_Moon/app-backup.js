/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// DATA \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

let platformCount = 10;
let platforms = [];
let isJumping = false;
let descent;
let ascent = 20;
let startingPoints;
let score;
let downTimer; // very important when it comes to resetting jumps
let upTimer; // very important when it comes to resetting jumps
let moveTimer;
let jumpSound;
let keydown = "";

const movement = {
  descent: 0,
  ascent: 20,
  keydown: "",
  getDescent = () =>  {
    return this.descent;
  },
  setDescent = (num) =>  {
    this.descent = num;
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// MISCELLANEOUS \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

class audioEffect {
  constructor(source) {
    this.sound = document.createElement("audio");
    this.sound.src = source;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }
  play() {
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
  changeMusic(src) {
    this.sound.src = src;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// BUILDING PLAY AREA \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

const startMenu = () => {
  $playArea = $(".playArea").css({
    width: "400px",
    height: "600px",
    "background-color": "#191919",
    position: "relative",
    background:
      "url(https://cdn.statically.io/img/i.pinimg.com/originals/6c/10/41/6c104134a19348812711bc77d068e315.jpg)",
    "background-size": "cover",
  });

  $startText = $("<div>")
    .attr("id", "startGame")
    .text("HODL!!!")
    .css({
      color: "white",
      width: "200px",
      height: "200px",
      position: "relative",
      margin: '0 auto',
      top: '50%',
      'font-size': '50px'
    });

  $playArea.append($startText);
};

const render = () => {
  const $rocket = $("<div>").addClass("rocket").css({
    width: "50px",
    height: "60px",
    "background-color": "#057DCD",
    position: "absolute",
    left: "200px",
    bottom: "400px",
    background: "url(assets/doge-rocket.png)",
    "background-size": "cover",
  });

  const $highScore = $("<div>")
    .addClass("score")
    .text(`Highscore: ${score}`)
    .css({ color: "white", "background-color": "black", opacity: "0.5" });

  $(".playArea").append($highScore);
  $(".playArea").append($rocket);
};

const reset = () => {
  isJumping = true;
  clearInterval(moveTimer); //
  clearInterval(upTimer);
  clearInterval(downTimer);
  platforms = [];
  stageSound.stop();
  $(".playArea").empty();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ROCKET MOVEMENTS \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

const down = () => {
  if (!isJumping) {
    clearInterval(upTimer);
    let $rocketBottom = parseFloat($(".rocket").css("bottom"));
    let $rocketLeft = parseFloat($(".rocket").css("left"));
    let rocketNewLow = $rocketBottom - descent;
    $(".rocket").css("bottom", `${rocketNewLow}px`);
    for (const platform of platforms) {
      if (
        $rocketLeft >= parseFloat(platform.css("left")) - 25 &&
        $rocketLeft <= parseFloat(platform.css("left")) + 110 &&
        $rocketBottom >= parseFloat(platform.css("bottom")) - 10 &&
        $rocketBottom <= parseFloat(platform.css("bottom")) + 25
      ) {
        console.log("platform touched");
        isJumping = true;
        startingPoint = parseFloat($(".rocket").css("bottom"));
        descent = 3;
        jumpSound.play();
        upTimer = setInterval(up, 50, startingPoint); // need to sort this out causing the game to spazz
      }
    }
    if ($rocketBottom <= 0) {
      isJumping = true;
      gameOver();
    }
    descent += 0.5;
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
    downTimer = setInterval(down, 30);
  } else if ($rocketBottom >= 540) {
    isJumping = false;
    startingPoint = -5;
    downTimer = setInterval(down, 30);
  }
};

const moveRocket = () => {
  let $rocketLeft = parseFloat($(".rocket").css("left"));
  if ($rocketLeft > 350) {
    console.log($rocketLeft);
    $rocketLeft = 0;
  } else if ($rocketLeft < 0) {
    $rocketLeft = 350;
  }
  switch (keydown) {
    case "ArrowLeft":
      let moveLeft = $rocketLeft - 10;
      $(".rocket").css("left", `${moveLeft}px`);
      break;
    case "ArrowRight":
      let moveRight = $rocketLeft + 10;
      $(".rocket").css("left", `${moveRight}px`);
      break;
  }
  window.requestAnimationFrame(moveRocket);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// PLATFORMS \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

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
  if (score === 50) {
    $(".platform").remove();
    clearInterval(downTimer);
    clearInterval(moveTimer);
    platforms = [];
    platformCount = 7;
    createPlatforms();
    downTimer = setInterval(down, 10);
    moveTimer = setInterval(movePlatforms, 10);
    // 
  }
  if (score === 120) {
    $(".platform").remove();
    clearInterval(downTimer);
    clearInterval(moveTimer);
    platforms = [];
    platformCount = 5;
    createPlatforms();
    moveTimer = setInterval(movePlatforms, 10);
    downTimer = setInterval(down, 10);
  }
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
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// GAME EXECUTION \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

const gameOn = () => {
  isJumping = false;
  score = 0;
  descent = 3;
  $(".playArea").css({
    background:
      "url(https://cdn.statically.io/img/i.pinimg.com/originals/6c/10/41/6c104134a19348812711bc77d068e315.jpg)",
    "background-size": "cover",
  });
  $("#restartGame").remove();
  $("#startGame").remove();
  render();
  createPlatforms();
  stageSound.play();
  moveTimer = setInterval(movePlatforms, 10);
  downTimer = setInterval(down, 30); // sort this out, causing game to spazz
};

const gameOver = () => {
  reset();
  $(".playArea").css({
    background:
      "url(https://cdn.statically.io/img/i.pinimg.com/originals/6c/10/41/6c104134a19348812711bc77d068e315.jpg)",
    "background-size": "cover",
    "text-align": "center",
  });
  $button = $(`<input type = button value="Restart" id = "restartGame">`);
  $(".playArea").append($button);
  $("#restartGame").on("click", gameOn);
};

const main = () => {
  startMenu();
  jumpSound = new audioEffect("./assets/jump.mp3");
  stageSound = new audioEffect("./assets/1LudiDream.mp3");
  // $("body").keydown(moveRocket); // declare outside of gameOn to prevent it from being recalled
  document.body.addEventListener("keydown", (e) => {
    keydown = e.key;
  });
  document.body.addEventListener("keyup", (e) => {
    keydown = "";
  });
  window.requestAnimationFrame(moveRocket);
  $("#startGame").on("click", gameOn);
};

$(main);
