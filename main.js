//#region GAME LOGIC AND DATA

//DATA
let clickCount = 0;
let maxClickCount = 0;// BLAAAAD NE ZABUD SDELAT DOLVOEB
let height = 120;
let width = 100;
let inflationRate = 20;
let maxsize = 300;
let currentPopCount = 0;
let highestPopCount = 0;
let gameLength = 10000;
let clockId = 0;
let timeRemaining = 0;
let currentPlayer = {};
let currentColor = 'darkblue';
let possibleColors = ['darkblue', 'green', 'cyan', 'purple', 'pink', 'orange'];


function startGame() {
    document.getElementById("game-controls").classList.remove("hidden");
    document.getElementById("main-controls").classList.add("hidden");
    document.getElementById("scoreboard").classList.add("hidden");




    startClock();
    setTimeout(stopGame, gameLength);
}
function startClock() {
    timeRemaining = gameLength;
    drawClock();
    clockId = setInterval(drawClock, 1000);
}
function stopClock() {
    clearInterval(clockId);
}

function drawClock() {

    let countdownElem = document.getElementById('countdown');
    countdownElem.innerText = (timeRemaining / 1000).toString();
    timeRemaining -= 1000;

}



function inflate() {
    clickCount++
    height += inflationRate;
    width += inflationRate;
    checkBalloonPop();
    draw();
}

function checkBalloonPop() {
    if (height >= maxsize) {
        console.log("pop the balloon");
        let balloonElement = document.getElementById("balloon");
        balloonElement.classList.remove(currentColor);
        getRandomColor();
        balloonElement.classList.add(currentColor);
        currentPopCount++;
        // @ts-ignore
        document.getElementById("pop-sound").play()
        height = 0;
        width = 0;
    }
}
function getRandomColor() {
    let i = Math.floor(Math.random() * possibleColors.length);
    currentColor = possibleColors[i];
}


function draw() {
    let balloonElement = document.getElementById("balloon");
    let clickCountElem = document.getElementById("click-count");
    let popCountElem = document.getElementById("pop-count");
    let highPopCountElem = document.getElementById("top-pop-count");
    let highClickElem = document.getElementById("top-click-count");
    let playerNameElem = document.getElementById("player-name");

    balloonElement.style.height = height + "px";
    balloonElement.style.width = width + "px";
    highPopCountElem.innerText = currentPlayer.topPop.toString();
    highClickElem.innerText = currentPlayer.topClick.toString();

    playerNameElem.innerText = "Current Player: " + currentPlayer.name.toString();

    clickCountElem.innerText = clickCount.toString();
    popCountElem.innerText = currentPopCount.toString();

}

function stopGame() {
    console.log("the game is over");

    document.getElementById("main-controls").classList.remove("hidden");
    document.getElementById("game-controls").classList.add("hidden");
    document.getElementById("scoreboard").classList.remove("hidden");

    if (clickCount > currentPlayer.topClick) {
        currentPlayer.topClick = clickCount;
    }
    clickCount = 0;
    if (currentPopCount > currentPlayer.topPop) {
        currentPlayer.topPop = currentPopCount;
        savePlayers();
    }
    currentPopCount = 0;
    //clickCount = 0;// VOT TOT ONO SBRASIVAET A POP COUNT NET 
    height = 120;
    width = 100;
    stopClock();
    draw();
    drawScoreboard();

}



//#endregion

let players = [];
loadPlayers();

function setPlayer(event) {
    event.preventDefault()
    let form = event.target;
    let playerName = form.playerName.value;

    currentPlayer = players.find(player => player.name == playerName)

    if (!currentPlayer) {
        currentPlayer = { name: playerName, topPop: 0, topClick: 0 };
        players.push(currentPlayer);
        savePlayers();
    }
    form.reset();
    document.getElementById('game').classList.remove("hidden");
    form.classList.add("hidden");
    draw();
    drawScoreboard();
}

function changePlayer() {
    document.getElementById("player-form").classList.remove("hidden");
    document.getElementById("game").classList.add("hidden");

}
function savePlayers() {
    window.localStorage.setItem("players", JSON.stringify(players));
}

function loadPlayers() {
    let playerData = JSON.parse(window.localStorage.getItem("players"));
    if (playerData) {
        players = playerData;
    }
}

function drawScoreboard() {
    let template = ""

    players.sort((p1, p2) => p2.topClick - p1.topClick)

    players.forEach(player => {
        template += `
        <div class="d-flex space-between">
            <span>
                <i class="fa fa-user" aria-hidden="true"></i>
                ${player.name}
            </span>
            <span class="text-center">
            Top Pops: ${player.topPop}
            </span>
            <span class="text-center">
            Top Clicks: ${player.topClick}
            </span>
        </div>
        `
    })

    document.getElementById("players").innerHTML = template;
}

drawScoreboard();







