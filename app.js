/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// DATA \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

let platformCount = 10;
let platforms = [];
let score;
let downTimer; // very important when it comes to resetting jumps
let upTimer; // very important when it comes to resetting jumps
let moveTimer;
let jumpSound;
let traverse;

const movement = {
  isJumping: false,
  descent: 3,
  ascent: 20,
  startingPoints: 0,
  keydown: "",
  getJumping() {
    return this.isJumping;
  },
  setJumping(boolean) {
    this.isJumping = boolean;
  },
  getDescent() {
    return this.descent;
  },
  setDescent(num) {
    this.descent = num;
  },
  getAscent() {
    return this.ascent;
  },
  setAscent(num) {
    this.ascent = num;
  },
  getSP() {
    return this.startingPoints;
  },
  setSP(num) {
    this.startingPoints = num;
  },
  getKeydown() {
    return this.keydown;
  },
  setKeydown(num) {
    this.keydown = num;
  },
};

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
  $title = $("<div>")
    .attr("id", "title")
    .text("DO YOU HAVE DIAMOND HANDS? CLICK HODL TO START");
  $gif = $("<div>").attr("id", "gif");
  $startText = $("<div>").attr("id", "startGame").text("HODL");

  $playArea.append($title).append($gif).append($startText);
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ROCKET MOVEMENTS \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

const down = () => {
  console.log(movement.getDescent());
  if (movement.getJumping()) { //guard
    return;
  }
  clearInterval(upTimer);
  let $rocketBottom = parseFloat($(".rocket").css("bottom"));
  let $rocketLeft = parseFloat($(".rocket").css("left"));
  let rocketNewLow = $rocketBottom - movement.getDescent();
  $(".rocket").css("bottom", `${rocketNewLow}px`);
  for (const platform of platforms) {
    const contact =
      $rocketLeft >= parseFloat(platform.css("left")) - 25 &&
      $rocketLeft <= parseFloat(platform.css("left")) + 85 &&
      $rocketBottom >= parseFloat(platform.css("bottom")) - 10 &&
      $rocketBottom <= parseFloat(platform.css("bottom")) + 25;
    if (contact) {
      movement.setJumping(true);
      movement.setSP(parseFloat($(".rocket").css("bottom")));
      movement.setDescent(3);
      jumpSound.play();
      upTimer = setInterval(up, 30, movement.getSP()); // need to sort this out causing the game to spazz
    }
  }
  if ($rocketBottom <= 0) {
    movement.setJumping(true);
    gameOver();
  }
  movement.setDescent(movement.getDescent() + 0.25);
};

const up = (liftPoint) => {
  console.log(movement.getAscent());
  let $rocketBottom = parseFloat($(".rocket").css("bottom"));
  if (movement.getJumping() === true) {
    clearInterval(downTimer);
    let rocketHigh = $rocketBottom + movement.getAscent();
    $(".rocket").css("bottom", `${rocketHigh}px`);
  }
  if ($rocketBottom >= liftPoint + 120) {
    movement.setJumping(false);
    downTimer = setInterval(down, 30);
  } else if ($rocketBottom >= 540) {
    movement.setJumping(false);
    downTimer = setInterval(down, 30);
  }
};

const moveRocket = () => {
  let $rocketLeft = parseFloat($(".rocket").css("left"));
  if ($rocketLeft > 350) {
    $rocketLeft = 0;
  } else if ($rocketLeft < 0) {
    $rocketLeft = 350;
  }
  switch (movement.getKeydown()) {
    case "ArrowLeft":
      let moveLeft = $rocketLeft - traverse;
      $(".rocket").css("left", `${moveLeft}px`);
      break;
    case "ArrowRight":
      let moveRight = $rocketLeft + traverse;
      $(".rocket").css("left", `${moveRight}px`);
      break;
  }
  window.requestAnimationFrame(moveRocket);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// PLATFORMS \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

const createPlatforms = (pcount) => {
  for (let i = 0; i < pcount; i++) {
    let platformSpace = 600 / pcount;
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
  if (score % 20 === 0 && score <= 40) {
    $(".playArea").find(".platform:nth-child(2)").remove();
    platforms.splice(1,1);
    $(".playArea").find(".platform").last().remove();
    platforms.pop();
    $(".playArea").find(".platform").first().remove();
  }
  if (score === 60) {
    clearInterval(moveTimer);
    traverse = 20;
    moveTimer = setInterval(movePlatforms, 2);
  }
  $(".score").text(`Highscore: ${Math.pow(score, 2)} BTC`);
  platforms.push($platform);
  $(".playArea").append($platform);
};

const movePlatforms = () => {
  if (parseFloat($(".rocket").css("bottom")) > 300) {
    platforms.forEach((platform) => {
      let newBottom = parseFloat(platform.css("bottom")) - 3;
      platform.css("bottom", `${newBottom}` + `px`);
      if (parseFloat(platform.css("bottom")) < 3) {
        $(".playArea").find(".platform").first().remove();
        platforms.shift();
        newPlatform(590);
      }
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// GAME EXECUTION \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

const gameOn = () => {
  $(".scoreboard").remove();
  $("#title").remove();
  $("#gif").remove();
  movement.setJumping(false);
  traverse = 10;
  score = 0;
  $(".playArea").css({
    background:
      "url(https://cdn.statically.io/img/i.pinimg.com/originals/6c/10/41/6c104134a19348812711bc77d068e315.jpg)",
    "background-size": "cover",
  });
  $("#restartGame").remove();
  $("#startGame").remove();
  render();
  platformCount = 10;
  createPlatforms(platformCount);
  moveTimer = setInterval(movePlatforms, 10);
  downTimer = setInterval(down, 30);
};

const reset = () => {
  clearInterval(moveTimer); //
  clearInterval(upTimer);
  clearInterval(downTimer);
  movement.setDescent(3);
  movement.setAscent(20);
  platforms = [];
  $(".playArea").empty();
};

const gameOver = () => {
  reset();
  $(".playArea").css({
    background: "url(assets/lose-screen.jpg)",
    "background-size": "cover",
    "text-align": "center",
  });
  $button = $(`<input type = button value="BUY THE DIP" id = "restartGame">`);
  $scoreboard = $("<div>")
    .addClass("scoreboard")
    .text(`You failed to HODL, you only got ${Math.pow(score,2)} BTC`);
  $(".playArea").append($scoreboard).append($button);
  $("#restartGame").on("click", gameOn);
};

const main = () => {
  startMenu();
  jumpSound = new audioEffect("./assets/jump.mp3");
  stageSound = new audioEffect("./assets/1LudiDream.mp3");
  $("body").on("keydown", (e) => {
    movement.setKeydown(e.key);
  });
  $("body").on("keyup", (e) => {
    movement.setKeydown("");
  });
  window.requestAnimationFrame(moveRocket);
  $("#startGame").on("click", gameOn);
};

$(main);
