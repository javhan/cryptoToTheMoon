let platformCount = 5;
let platforms = [];

const render = () =>    {
    const $playArea = $(".playArea").css({
        width: '400px',
        height: '600px',
        "background-color": "#191919",
        position: 'relative',

    })

    const $rocket = $('<div>').addClass("rocket").css({
        width: '30px',
        height: '60px',
        "background-color": "#057DCD",
        position: "absolute",
        left: '50%',
        bottom: '200px'
    })

    $playArea.append($rocket);
}

const down = () =>  {
    $('.rocket').animate({top: "300px"}, 500)
    up();
}

const up = () => {
    $('.rocket').animate({top: "0px"}, 500)
    down();
}

const moveRocket = (event) =>   {
    if (event.key === "ArrowLeft")  {
        // move left
    }   else if (event.key === "ArrowRight") {
        // move right
    }
}

const createPlatforms = (event) => {
    for (let i = 0; i < platformCount; i++) {
        let platformSpace = 600 / platformCount;
        let newPlatBottom = 100 + i * platformSpace;
        const $platform = $('<div>').addClass('platform').css({
            width: '85px',
            height: '15px',
            'background-color': "red",
            position: 'absolute',
            left: `${Math.random() * 315}px`,
            bottom: `${newPlatBottom}px`,
        })
        event.append($platform);
        platforms.push($platform);
        console.log(platforms);
    }
}

const newPlatform = (newPlatBottom) => {
    console.log(platforms);
    const $platform = $('<div>').addClass('platform').css({
        width: '85px',
        height: '15px',
        'background-color': "red",
        position: 'absolute',
        left: `${Math.random() * 315}px`,
        bottom: `${newPlatBottom}px`,
    })
    platforms.push($platform);
    $('.playArea').append($platform);
} 

const movePlatforms = () => {
    if (parseFloat($(".rocket").css("bottom")) > 100) {
        platforms.forEach(platform => {
            let newBottom = parseFloat(platform.css("bottom")) - 3;
            platform.css("bottom", `${newBottom}` + `px`);
            if (parseFloat(platform.css("bottom")) < 10)  {
                platforms.shift();
                $('.playArea').find(".platform").first().remove();
                newPlatform(600);
            }
        })
    }
}

const main = () =>  {
    render();
    createPlatforms($('.playArea'))
    setInterval(movePlatforms, 30);
    // down();
}

$(main);