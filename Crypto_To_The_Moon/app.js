let platformCount = 5;
let platforms = [];

const startMenu = () => {

}

const render = () => {
  const $playArea = $(".playArea").css({
    width: "400px",
    height: "600px",
    "background-color": "#191919",
    position: "relative",
    background:
      "url(https://cdn.statically.io/img/i.pinimg.com/originals/6c/10/41/6c104134a19348812711bc77d068e315.jpg)",
    "background-size": "cover",
  });

  const $rocket = $("<div>").addClass("rocket").css({
    width: "50px",
    height: "60px",
    "background-color": "#057DCD",
    position: "absolute",
    left: "50%",
    bottom: "200px",
    background: "url(assets/free-rocket.png)",
    "background-size": 'cover' 
  });

  $playArea.append($rocket);
};

const down = () => {
  $(".rocket").animate({ top: "400px" }, 1000);
  up();
};

const up = () => {
  $(".rocket").animate({ top: "0px" }, 1000);
  down();
};

const moveRocket = (event) => {
  if (event.key === "ArrowLeft") {
    // move left
  } else if (event.key === "ArrowRight") {
    // move right
  }
};

const createPlatforms = (event) => {
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
      });
    $platform.text("PRICE FLOOR");
    event.append($platform);
    platforms.push($platform);
    console.log(platforms);
  }
};

const newPlatform = (newPlatBottom) => {
  console.log(platforms);
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
    });
  $platform.text("PRICE FLOOR");
  platforms.push($platform);
  $(".playArea").append($platform);
};

const movePlatforms = () => {
  if (parseFloat($(".rocket").css("bottom")) > 100) {
    platforms.forEach((platform) => {
      let newBottom = parseFloat(platform.css("bottom")) - 3;
      platform.css("bottom", `${newBottom}` + `px`);
      if (parseFloat(platform.css("bottom")) < 3) {
        platforms.shift();
        $(".playArea").find(".platform").first().remove();
        newPlatform(590);
      }
    });
  }
};

const gameOn = () =>    {

}

const gameOver = () =>  {

}

const main = () => {
  render();
  createPlatforms($(".playArea"));
  setInterval(movePlatforms, 15);
//   down();
};

$(main);
