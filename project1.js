// JS Data
const platforms = [];
let startPoint = 90;
const platBottom = startPoint;
let isGameOver = false;
let jumpDist = 20;
let fallDist = 10;
let isJumping;
let jumpTimer;
let fallTimer;
let score = 0;
let isPlayButtonClicked = false;
const $gameTitle = $("<h1>").addClass("game-title").text("doodle jump");
const $instructions = $("<p>").addClass("instructions").text("move the doodler with your left & right arrow keys");
const $playButton = $("<button>").attr("type", "button").addClass("play").text("play");
const $animateDoodler = $("<div>").addClass("animate-doodler");

// CSS Data
const containerWidth = 600
const containerHeight = 700;
const platformWidth = 100;
const platformHeight = 10;
const doodlerWidth = 87;
const doodlerLegWidth = 55;

// Functions
const makeMenu = () => {
    $(".container").append($gameTitle);
    $(".container").append($instructions);
    $(".container").append($playButton);
    $(".container").append($animateDoodler);
}

const makePlatforms = (num) => {
    for (let i = 1; i <= num; i++) {
        const $platform = $("<div>").addClass("platform");
        let randLeft = Math.random() * (containerWidth - platformWidth);
        let randBottom = platBottom * i;
        $platform.css("left", `${randLeft}` + `px`);
        $platform.css("bottom", `${randBottom}` + `px`);
        platforms.push($platform);
        $(".container").append($platform);
    }
}

const newPlatform = (newPlatBottom) => {
    const $platform = $("<div>").addClass("platform");
    let randLeft = Math.random() * (containerWidth - platformWidth);
    $platform.css("left", `${randLeft}` + `px`);
    $platform.css("bottom", `${newPlatBottom}` + `px`);
    if (score > 15) {
        let randPlatform = Math.random();
        if (randPlatform < 0.5) {
            $platform.addClass("platform-horizontal");
            platforms.push($platform);
            $(".container").append($platform);
        } else {
            platforms.push($platform);
            $(".container").append($platform);
        }
    } else {
        platforms.push($platform);
        $(".container").append($platform);
    }
}

const refreshPlatforms = () => {
    if (parseFloat($(".doodler").css("bottom")) > 300) { // 300 is arbitrary and based on trial and error
        platforms.forEach(platform => {
            let newBottom = parseFloat(platform.css("bottom")) - 3; // decrease by 3px is arbitrary and based on trial and error
            platform.css("bottom", `${newBottom}` + `px`);
            if (parseFloat(platform.css("bottom")) < 3) { // removing platform if it's less than 3px from the bottom is arbitrary and based on trial and error
                let firstPlatform = platforms[0];
                firstPlatform.removeClass();
                platforms.shift();
                score++;
                newPlatform(600);
            }
        })
    }
}

const makeDoodler = () => {
    const $doodler = $("<div>").addClass("doodler");
    let doodlerLeft = parseFloat(platforms[0].css("left")) + (platformWidth * Math.random()) - doodlerLegWidth;
    let doodlerBottom = platBottom + platformHeight;
    $doodler.css("left", `${doodlerLeft}` + `px`);
    $doodler.css("bottom", `${doodlerBottom}` + `px`);
    $(".container").append($doodler);
}

const fall = () => {
    isJumping = false;
    clearInterval(jumpTimer);
    fallTimer = setInterval(function() {
        let doodlerBottom = parseFloat($(".doodler").css("bottom")) - fallDist;
        $(".doodler").css("bottom", `${doodlerBottom}` + `px`);
        // fallDist *= 1.005; tried to increase speed as doodler is falling but doodler fell through the platform
        if (parseFloat($(".doodler").css("bottom")) <= 0) {
            isPlayButtonClicked = false;
            isGameOver = true;
            gameOver();
        }
        platforms.forEach(platform => {
            if (
                (parseFloat($(".doodler").css("bottom")) >= parseFloat(platform.css("bottom"))) &&
                (parseFloat($(".doodler").css("bottom")) <= parseFloat(platform.css("bottom")) + platformHeight) &&
                (parseFloat($(".doodler").css("left")) + doodlerLegWidth >= parseFloat(platform.css("left"))) &&
                (parseFloat($(".doodler").css("left")) <= parseFloat(platform.css("left")) + platformWidth)
            ) {
                console.log("jumped on platform");
                startPoint = parseFloat($(".doodler").css("bottom"));
                isJumping = true;
                jump();
            }
        })
    }, 35);
}

const jump = () => {
    isJumping = true;
    clearInterval(fallTimer);
    jumpTimer = setInterval(function() {
        let doodlerBottom = parseFloat($(".doodler").css("bottom")) + jumpDist;
        $(".doodler").css("bottom", `${doodlerBottom}` + `px`);
        jumpDist *= 0.9; // simulate gravity, doodler's velocity drops as he goes higher
        if (parseFloat($(".doodler").css("bottom")) > startPoint + 150) {
            isJumping = false;
            jumpDist = 20;
            fall();
        }
    }, 35);
}

const moveLeftRight = (event) => {
    if (event.key === "ArrowLeft") {
        if (parseFloat($(".doodler").css("left")) < -doodlerWidth) {
            $(".doodler").css("left", `${containerWidth}` + `px`);
        } else {
            $(".doodler").animate({left: "-=15"}, 10); 
            console.log("left");
        }
    } else if (event.key === "ArrowRight") {
        if (parseFloat($(".doodler").css("left")) > containerWidth) {
            $(".doodler").css("left", `${-doodlerWidth}` + `px`);
        } else {
            $(".doodler").animate({left: "+=15"}, 10);
            console.log("right");
        }
    }
}

const gameOver = () => {
    clearInterval(jumpTimer);
    clearInterval(fallTimer);
    $(".container").empty();
    const $gameOverDiv = $("<h2>").addClass("game-over").text("game over!");
    const $score = $("<p>").addClass("score").text(`your score: ` + `${score}`);
    $(".container").append($gameOverDiv);
    $(".container").append($score);
    $(".container").append($animateDoodler);
}

const startGame = () => {
    $(".container").empty();
    makePlatforms(7);
    makeDoodler();
    setInterval(refreshPlatforms, 15);
    jump(startPoint);
    document.onkeydown = moveLeftRight;
}

// Execute
$(() => {
    makeMenu();
    $playButton.on("click", () => {
        isPlayButtonClicked = true;
        startGame();
    });
});