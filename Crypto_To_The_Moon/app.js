const append = () =>    {
    const $playArea = $(".playArea").css({
        width: '300px',
        height: '400px',
        "background-color": "#191919",
        display: 'flex',
        "align-items": 'center',
        "justify-content": 'center',

    })

    const $rocket = $('<div>').addClass("rocket").css({
        width: '30px',
        height: '60px',
        "background-color": "#057DCD",
        position: "relative",
    })

    $playArea.append($rocket);
    down();
}

const down = () =>  {
    $('.rocket').animate({top: "170px"}, 1000, up)
}

const up = () => {
    $('.rocket').animate({top: "0px"}, 1000, down)
}

const main = () =>  {
    append();
}

$(main);