const colors = ["green", "red", "blue", "yellow"];
const sounds = {
  "green" : new Howl({src: ["../simon-game/media/simonSound1.mp3","https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"], format: ["mp3"]}), 
  "red" : new Howl({src: ["../simon-game/media/simonSound2.mp3","https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"], format: ["mp3"]}), 
  "yellow" : new Howl({src: ["../simon-game/media/simonSound3.mp3","https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"], format: ["mp3"]}),
  "blue" : new Howl({src: ["../simon-game/media/simonSound4.mp3","https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"], format: ["mp3"]})
}
let count = 0;
let on = false;
let strict = false;
let winningPattern = [];
let currentPattern;
let nGuess = 0;
let speed;

function getColors(color) {
    let shades;
    if (color == "green") {
         shades = ["lime","#99cc99"];
    } else if (color == "red") {
        shades = ["pink", "#cc9999"];
    } else if (color == "yellow") {
        shades = ["yellow", "#cccc99"];
    } else if (color == "blue") {
        shades = ["aqua","#99cccc"];
    }
    return shades;
}

function resetSounds(){
    setTimeout(function(){
        for(let sound in sounds){
            sound.currentTime = 0;
        }
    }, 200);
}

function flash(color) {
    if(on){
        let currentColors = getColors(color);
        document.getElementById(color).style.background = currentColors[0];
        resetSounds();
        setTimeout(function() {
            document.getElementById(color).style.background = currentColors[1];
            sounds[color].play();
        }, 300);
    }
    return sounds[color]
}

function setPattern() {
    if (winningPattern.length > 0) {
        while (winningPattern.length > 0) {
            winningPattern.pop();
        }
    }
    for (let i = 0; i < 20; i++) {
        let newColor = colors[Math.floor(Math.random() * colors.length)];
        winningPattern.push(newColor);
    }
}

function playPattern(pattern) {
    let c = 0;
    let flashColors = setInterval(function() {
        if (c < pattern.length) {
            flash(pattern[c]);
            c++;
        } else {
            clearInterval(flashColors);
        }
    }, speed);
}

function updateCounter() {
    count++;
    if (count < 10) {
        document.getElementById('counter').innerHTML = "0" + count;
    } else {
        document.getElementById('counter').innerHTML = count;
    }
}

function newRound() {
    nGuess = 0;
    updateCounter();
    currentPattern = winningPattern.slice(0, count);
    if (count == 5 || count == 9 || count == 13){
        speed -= 100;
    }
    setTimeout(function() {
        playPattern(currentPattern);
    }, speed);
}

function checkGuess(guess) {
    if (currentPattern[nGuess] == guess) {
        return true;
    }
    return false;
}

function errorSound() {
    document.getElementById('counter').innerHTML = '!!';
    sounds["blue"].play();
    sounds["green"].play();
    sounds["red"].play();
    sounds["yellow"].play();
    setTimeout(function() {
        count--;
        updateCounter();
    }, 400);
}

function newGame(isStrict) {
    strict = isStrict;
    count = 0; 
    nGuess = 0;
    speed = 1000;
    setPattern();
    newRound();
}

function gameOver() {
    let f = 0;
    let flasher = setInterval(function() {
        if (f < colors.length) {
            flash(colors[f]);
            f++;
        } else {
            clearInterval(flasher);
        }
    }, 300);
    setTimeout(function() {
        newGame(strict);
    }, 500);
}

function pickColor(color) {
    flash(color);
    if (count > 0) {
        let win = checkGuess(color);
        if (win) {
            nGuess++;
        if (winningPattern.length == nGuess) { 
            gameOver();
        } else {
            if (count == nGuess) {
                newRound();
            }
        }
        } else {
            if (!strict) {
                nGuess = 0;
                errorSound();
                setTimeout(function() {
                    playPattern(currentPattern);
                }, speed);
            } else {
                errorSound();
                gameOver();
            }
        }
    }
}

document.getElementById("onOff").addEventListener('click', function(){
    on = !on;
    if (on) {
        document.getElementById('onOff').style.backgroundColor = '#FFFFFF';
        document.getElementById('onOff').style.justifyContent = 'flex-end';
        document.getElementById('counter').innerHTML = '--';
        document.getElementById('counter').style.color = 'red';
        document.getElementById('startPlay').disabled = false;
        document.getElementById('strictPlay').disabled = false; 
    } else {
        document.getElementById('onOff').style.backgroundColor = '#666666';
        document.getElementById('onOff').style.justifyContent = 'flex-start';
        document.getElementById('counter').innerHTML = '--';
        document.getElementById('counter').style.color = 'black';
        document.getElementById('startPlay').disabled = true;
        document.getElementById('strictPlay').disabled = true;
    }
});

document.getElementById("startB").addEventListener('click', function(){
    newGame(false);
});

document.getElementById("strictB").addEventListener('click', function(){
    newGame(true);
});

document.getElementById("red").addEventListener('click', function(){
    pickColor('red');
});

document.getElementById("yellow").addEventListener('click', function(){
    pickColor('yellow');
});

document.getElementById("green").addEventListener('click', function(){
    pickColor('green');
});

document.getElementById("blue").addEventListener('click', function(){
    pickColor('blue');
});
