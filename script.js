let url = 'https://api.openweathermap.org/data/2.5/weather';
let APIkey = '8830d9a0c3a419f55f3e4488ea421320';

function click() {
    var cityName = document.getElementById('cityName').value;
    if (cityName == '') {
        cityName = 'saint+petersburg';
    } else {
        cityName = cityName.replace(/ /g,"+");
    }
    drawResult('','','','','','');
    document.getElementById("loader").style.display = "block";
    search(cityName);
}

document.getElementById('search').onclick = click;

function search(cityName) {
    var destinationURL = url + '?q=' + cityName + '&APPID=' + APIkey;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let data = JSON.parse(xmlHttp.responseText);
            console.log(data);
            drawResult(
            'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png',
            '',
            data.name + ', ' + data.sys.country,
            'Weather: ' + data.weather[0].main + ' ( ' + data.weather[0].description + ' )',
            'Temperature: ' + (data.main.temp - 273.15).toFixed(0) + '°C',
            'Wind: ' + data.wind.speed + ' m/s');
        } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
            console.log(xmlHttp.responseText);
            let data = JSON.parse(xmlHttp.responseText);
            drawResult(
                '',
                'Congratulations, you broke the site! :) \n (Most likely, the problem is this: ' + data.message + ' )',
                '',
                '',
                '',
                ''
            );
        } 
    }
    xmlHttp.open("GET", destinationURL, true);
    xmlHttp.send(null);
}

function drawResult(pic, myError, place, weather, temprature, wind) {
    document.getElementById('loader').style.display = "none";
    document.getElementById('picture').src = pic;
    document.getElementById('myErrorContainer').innerText = myError;
    document.getElementById('place').innerText = place;
    document.getElementById('weather').innerText = weather;
    document.getElementById('temperature').innerText = temprature;
    document.getElementById('wind').innerText = wind;
}