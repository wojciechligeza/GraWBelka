var ball;
var paddle;
var score;
var playingArea;
var gear;
var controls;
var newButton;
var difficultySelect;
var doneButton;

var availableWidth;
var availableHeight;
var playingAreaWidth;
var playingAreaHeight;
var speedX = 2;
var speedY = 2;
var paddleSpeedX = 48;
var currentScore = 0;
var timer;
var paddleLeft = 228;
var ballLeft = 100;
var ballTop = 8;
var drag = false;

window.addEventListener('load', init);
window.addEventListener('resize', init);

function init() {
    ball = document.getElementById('ball');
    paddle = document.getElementById('paddle');
    score = document.getElementById('score');
    playingArea = document.getElementById('playingArea');
    gear = document.getElementById('gear');
    controls = document.getElementById('controls');
    newButton = document.getElementById('new');
    difficultySelect = document.getElementById('difficulty');
    doneButton = document.getElementById('done');

    layoutPage();

    document.addEventListener('keydown', keyListener, false);

    playingArea.addEventListener('mousedown',mouseDown,false);
    playingArea.addEventListener('mousemove',mouseMove,false);
    playingArea.addEventListener('mouseup',mouseUp,false);
    playingArea.addEventListener('touchstart',mouseDown,false);
    playingArea.addEventListener('touchmove',mouseMove,false);
    playingArea.addEventListener('touchend',mouseUp,false);

    gear.addEventListener('click',showSettings,false);
    newButton.addEventListener('click', newGame, false);
    doneButton.addEventListener('click', hideSettings, false);
    difficultySelect.addEventListener('change', function() {
        setDifficulty(difficultySelect.selectedIndex);
    },false);

    timer = requestAnimationFrame(start);
}

function layoutPage() {
    availableWidth = innerWidth;
    availableHeight = innerHeight;
    playingAreaWidth = availableWidth - 22;
    playingAreaHeight = availableHeight - 22;
    playingArea.style.width = playingAreaWidth + 'px';
    playingArea.style.height = playingAreaHeight + 'px';
}

function keyListener(keyboard) {
    var key = keyboard.keyCode;
    if ((key == 37 || key == 65) && paddleLeft > 0) {
        paddleLeft -= paddleSpeedX;
        if(paddleLeft < 0)
            paddleLeft = 0;
    } else if ((key == 39 || key == 68) && paddleLeft < playingAreaWidth - 64) {
        paddleLeft += paddleSpeedX;
        if (paddleLeft > (playingAreaWidth - 64))
            paddleLeft = playingAreaWidth - 64;
    }
    paddle.style.left = paddleLeft + 'px';
}

function start() {
    render();
    detectCollisions();
    difficulty();
    if (ballTop < playingAreaHeight - 36) {
        timer = requestAnimationFrame(start);
    } else {
        gameOver();
    }
}

function render() {
    moveBall();
    updateScore();
}

function moveBall() {
    ballLeft += speedX;
    ballTop += speedY;
    ball.style.left = ballLeft + 'px';
    ball.style.top = ballTop + 'px';
}

function updateScore() {
    currentScore += 5;
    score.innerHTML = "Punkty: " + currentScore;
}

function detectCollisions() {
    if (collisionX()) {
        speedX *= -1;
    }
    if (collisionY()) {
        speedY *= -1;
    }
}

function collisionX() {
    if (ballLeft < 4 || ballLeft > playingAreaWidth - 20) {
        return true;
    }
    return false;
}

function collisionY() {
    if(ballTop < 4) {
        return true;
    }
    if(ballTop > playingAreaHeight - 64) {
       if (ballLeft >= paddleLeft + 16 && ballLeft < paddleLeft + 48) {
           if (speedX < 0) {
               speedX = -2;
           } else {
               speedX = 2;
           }
           return true;
       } else if (ballLeft >= paddleLeft && ballLeft < paddleLeft + 16) {
           if (speedX < 0) {
                speedX = -8;
           } else {
                speedX = 8;
           }
           return true;
       } else if(ballLeft >= paddleLeft + 48 && ballLeft <= paddleLeft + 64) {
           if (speedX < 0) {
                speedX = -8;
           } else {
                speedX = 8;
           }
           return true;
       }
    }
    return false;
}

function difficulty() {
    if (currentScore % 2000 == 0) {
        if (speedY > 0)
            speedY += 2;
        else
            speedY -= 2;
    }
}

function gameOver() {
    cancelAnimationFrame(timer);
    score.innerHTML += " KONIEC GRY";
    score.style.backgroundColor = 'red';
    showSettings();
}

function mouseDown(move) {
    drag = true;
}

function mouseUp(move) {
    drag = false;
}

function mouseMove(move) {
    if (drag) {
        move.preventDefault();
        paddleLeft = move.clientX - 32 || move.targetTouches[0].pageX - 32;
        if (paddleLeft < 0)
            paddleLeft = 0;
        if (paddleLeft > (playingAreaWidth - 64))
            paddleLeft = playingAreaWidth - 64;
        paddle.style.left = paddleLeft + 'px';
    }
}

function showSettings(){
    controls.style.display = 'block';
    cancelAnimationFrame(timer);
}

function hideSettings(){
    controls.style.display = 'none';
    timer = requestAnimationFrame(start);
}

function setDifficulty(set) {
    switch (set) {
        case 0:
            speedY = 2;
            paddleSpeedX = 48;
            break;
        case 1:
            speedY = 4;
            paddleSpeedX = 32;
            break;
        case 2:
            speedY = 6;
            paddleSpeedX = 16;
            break;
        default:
            speedY = 2;
            paddleSpeedX = 48;
    }
}

function newGame() {
    ballTop = 8;
    currentScore = 0;
    speedX = 2;
    setDifficulty(difficultySelect.selectedIndex);
    score.style.backgroundColor = 'violet';
    hideSettings();
}
