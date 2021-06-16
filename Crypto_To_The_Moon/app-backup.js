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

  $startText = $("<div>").attr("id", "startGame").text("HODL!!!");

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

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////// ROCKET MOVEMENTS \\\\\\\\\\
/////////////////////////////////////////////////////////////////////////////////////////////////////

const movement = {
  isJumping: false,
  descent: 3,
  ascent: 20,
  startingPoints: 0,
  keydown: "",
  getJumping: () => {
    return this.isJumping;
  },
  setJumping: (boolean) => {
    this.isJumping = boolean;
  },
  getDescent: () => {
    return this.descent;
  },
  setDescent: (num) => {
    this.descent = num;
  },
  getAscent: () => {
    return this.ascent;
  },
  setAscent: (num) => {
    this.ascent = num;
  },
  getSP: () => {
    return this.startingPoints;
  },
  setSP: (num) => {
    this.startingPoints = num;
  },
  getKeydown: () => {
    return this.keydown;
  },
  setKeydown: (num) => {
    this.keydown = num;
  },
};

const down = () => {
  if (!isJumping) {
    clearInterval(upTimer);
    let $rocketBottom = parseFloat($(".rocket").css("bottom"));
    let $rocketLeft = parseFloat($(".rocket").css("left"));
    let rocketNewLow = $rocketBottom - movement.getDescent();
    $(".rocket").css("bottom", `${rocketNewLow}px`);
    for (const platform of platforms) {
      if (
        $rocketLeft >= parseFloat(platform.css("left")) - 25 &&
        $rocketLeft <= parseFloat(platform.css("left")) + 85 &&
        $rocketBottom >= parseFloat(platform.css("bottom")) - 10 &&
        $rocketBottom <= parseFloat(platform.css("bottom")) + 25
      ) {
        movement.setJumping(true);
        movement.setSP(parseFloat($(".rocket").css("bottom")));
        movement.setDescent(3);
        jumpSound.play();
        upTimer = setInterval(up, 50, movement.getSP()); // need to sort this out causing the game to spazz
      }
    }
    if ($rocketBottom <= 0) {
      clearInterval(downTimer);
      gameOver();
    }
    movement.setDescent(movement.getDescent() + 0.5);
  }
};

const up = (liftPoint) => {
  let $rocketBottom = parseFloat($(".rocket").css("bottom"));
  if (isJumping) {
    clearInterval(downTimer);
    let rocketHigh = $rocketBottom + movement.getAscent();
    $(".rocket").css("bottom", `${rocketHigh}px`);
  }
  if ($rocketBottom >= liftPoint + 120) {
    isJumping = false;
    downTimer = setInterval(down, 30);
  } else if ($rocketBottom >= 540) {
    isJumping = false;
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
    clearInterval(moveTimer);
    platforms = [];
    platformCount = 8;
    createPlatforms();
    moveTimer = setInterval(movePlatforms, 10);
    //
  }
  if (score === 100) {
    $(".platform").remove();
    clearInterval(moveTimer);
    platforms = [];
    platformCount = 6;
    createPlatforms();
    moveTimer = setInterval(movePlatforms, 10);
  }
  $(".score").text(`Highscore: ${score}`);
  platforms.push($platform);
  $(".playArea").append($platform);
};

const movePlatforms = () => {
  if (parseFloat($(".rocket").css("bottom")) > 300) {
    platforms.forEach((platform) => {
      let newBottom = parseFloat(platform.css("bottom")) - 3;
      platform.css("bottom", `${newBottom}` + `px`);
      if (parseFloat(platform.css("bottom")) < 3) {
        // platform disappears here
        if (score === 50) {
          $(".playArea").find(".platform").last().remove();
          platforms.pop();
        }
        if (score === 100) {
          $(".playArea").find(".platform").last().remove();
          platforms.pop();
        }
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
  $('.scoreboard').remove();
  isJumping = false;
  score = 0;
  movement.setDescent(3);
  movement.setAscent(20);
  $(".playArea").css({
    background:
      "url(https://cdn.statically.io/img/i.pinimg.com/originals/6c/10/41/6c104134a19348812711bc77d068e315.jpg)",
    "background-size": "cover",
  });
  $("#restartGame").remove();
  $("#startGame").remove();
  render();
  platformCount = 10;
  createPlatforms();
  moveTimer = setInterval(movePlatforms, 10);
  downTimer = setInterval(down, 30); // sort this out, causing game to spazz
};

const reset = () => {
  isJumping = true;
  clearInterval(moveTimer); //
  clearInterval(upTimer);
  clearInterval(downTimer);
  platforms = [];
  $(".playArea").empty();
};

const gameOver = () => {
  reset();
  $(".playArea").css({
    background:
      "url(assets/lose-screen.jpg)",
    "background-size": "cover",
    "text-align": "center",
  });
  $button = $(`<input type = button value="BUY THE DIP" id = "restartGame">`);
  $scoreboard = $("<div>")
    .addClass("scoreboard")
    .text(`You failed to HODL, you only got ${score}`);
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
