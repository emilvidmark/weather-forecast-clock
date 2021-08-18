var canvas = document.getElementById("weatherClock");
var context = canvas.getContext("2d");

var radius = canvas.height / 2;
// This variable will hold the most recent weather data.
var result = []; 
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
    drawTime();
    drawImages();
    
    
}

function drawFace() {
    context.arc(0, 0, radius, 0, 2* Math.PI);
    context.fillStyle = "#101010";
    context.fill();

    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.fillStyle = "#101010";
    context.fill();
}

function drawImages() {
    var ang;
    var num;
    
    context.font = radius * 0.15 + "px arial";
    context.textBaseline = "middle";
    context.textAlign = "center";

    // Calculate which number to start with to get correct timestamp at hours
    // 27 is needed as the data is in GMT and Sweden is GMT+2, plus a offset of 1
    var offset = 27 - parseInt(result[0][0]);
    for(num = offset; num < offset + 12; num++){
        var i = num-offset;
        var imgSize = 120;
        var imgOffset = imgSize / 2;
        var img = new Image();  
        ang = (num+1) * Math.PI / 6;
        context.rotate(ang);
        context.translate(0, -radius * 0.85);
        context.rotate(-ang);
        console.log(result);
        img.src = getWeatherIcon(result[i][2], result[i][0]);
        context.drawImage(img, -imgOffset, -imgOffset, imgSize, imgSize);
        //context.fillText(result[i][2], 0, 0);
        context.rotate(ang);
        context.translate(0, radius * 0.85);
        context.rotate(-ang);
      }
}

// API Call
function getWeatherForecast() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            const response = JSON.parse(this.responseText);
            
            for (let i = 0; i < 12; i++) {
                var timeStampData = [];
                var timeStamp = response.timeSeries[i].validTime.substring(11,16);
                timeStampData.push(timeStamp);
                for (let j = 0; j < response.timeSeries[i].parameters.length; j++) {
                    if (response.timeSeries[i].parameters[j].name == "t") {
                        timeStampData.push(response.timeSeries[i].parameters[j].values[0]);
                    }
                    else if (response.timeSeries[i].parameters[j].name == "Wsymb2") {
                        timeStampData.push(response.timeSeries[i].parameters[j].values[0]);
                    }
        
                }
                result.push(timeStampData);
            }
        }
    }
    xhttp.open("GET", "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/22.153005/lat/65.584859/data.json", true);
    xhttp.send();
}


// Depending on the time of which time of the day the function will return the correct icon
// including a sun if it is day time and a moon if it is night time.
function getWeatherIcon(iconId, timeStamp) {
    //Need to check if icon for iconId has sun or moon in it
    const iconsWithSunOrMoon = [1,4,8,9,10];
    if (iconsWithSunOrMoon.includes(iconId)) {
        // Need to see if we should use the icon with the moon or the sun
        var isNight = isItNight(timeStamp);
        if(isNight) {
            sunOrMoonSelection = "-moon";
        } else {
            sunOrMoonSelection = "-sun";
        }
        
        return "icons/" + iconId + sunOrMoonSelection + ".svg";
    } else {
        return "icons/" + iconId + ".svg";
    }
}

// If it is night we want to show the moon instead of the sun in the icons
function isItNight(timeStamp) {
    //Let's say that day turns to night at 9pm and night turns to day at 6am
    const nightTimeValues = ["21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00"];
    if (nightTimeValues.includes(timeStamp)) {
        return true;
    } else {
        return false;
    }
    
}

function drawTime() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    
    hour = hour%12;
    hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
    context.strokeStyle = "#DDD";
    drawHand(hour, radius*0.3, radius*0.07);
    //minute
    minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(minute, radius*0.6, radius*0.07);
    // second
    context.strokeStyle = "#FF0000";
    second = (second*Math.PI/30);
    drawHand(second, radius*0.7, radius*0.02);
  }

  function drawHand(pos, length, width) {
    
    context.beginPath();
    context.lineWidth = width;
    context.lineCap = "round";
    context.moveTo(0,0);
    context.rotate(pos);
    context.lineTo(0, -length);
    context.stroke();
    context.rotate(-pos);
  }

getWeatherForecast();

setInterval(getWeatherForecast, 900000);
setInterval(drawClock, 1000);
resizeCanvas();

