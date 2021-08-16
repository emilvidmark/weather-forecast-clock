var canvas = document.getElementById("weatherClock");
var context = canvas.getContext("2d");

var radius = canvas.height / 2;

window.addEventListener('resize', resizeCanvas, false);



// We want the clock to fill the browser, depending on the device the width or height might be larger than the other
// and we want a square, so we pick the one which is the lowest
function resizeCanvas() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    
    canvas.width = windowWidth;
    canvas.height = windowHeight;
    if (windowWidth <= windowHeight) {
        radius = windowWidth / 2;
    } else {
        radius = windowHeight / 2;
    }

    centerWidth = windowWidth / 2;
    centerHeight = windowHeight /2;
    context.translate(centerWidth,centerHeight);
    radius = radius * 0.90;

    drawClock();
}

function drawClock() {
    drawFace();
    drawImages();
}

function drawFace() {
    context.arc(0, 0, radius, 0, 2* Math.PI);
    context.fillStyle = "#101010";
    context.fill();

    context.beginPath();
    context.arc(0, 0, radius * 0.03, 0, 2 * Math.PI);
    context.fillStyle = "#fff";
    context.fill();
}

function drawImages() {
    var ang;
    var num;
    
    context.font = radius * 0.15 + "px arial";
    context.textBaseline = "middle";
    context.textAlign = "center";
    for(num = 1; num < 13; num++){
        ang = num * Math.PI / 6;
        context.rotate(ang);
        context.translate(0, -radius * 0.85);
        context.rotate(-ang);
        context.fillText(num.toString(), 0, 0);
        context.rotate(ang);
        context.translate(0, radius * 0.85);
        context.rotate(-ang);
      }
}

resizeCanvas();

