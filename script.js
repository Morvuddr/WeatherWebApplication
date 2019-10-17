let url = 'https://api.openweathermap.org/data/2.5/weather';
let APIkey = '8830d9a0c3a419f55f3e4488ea421320';
let source = document.getElementById('hdlbrs_tmplt').innerHTML;
let template = Handlebars.compile(source);

document.getElementById('myFormID').addEventListener("submit", function(event){
    event.preventDefault();
    let cityName = event.target.cityName.value;
    if (cityName === '') {
        cityName = 'saint+petersburg';
    } else {
        cityName = cityName.replace(/ /g,"+");
        console.log(cityName);
    }
    //document.getElementById("loader").style.display = "block";
    search(cityName);
});

function search(cityName) {
    let destinationURL = url + '?q=' + cityName + '&APPID=' + APIkey;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let data = JSON.parse(xmlHttp.responseText);
            console.log(data);
            drawResult(data, '');
        } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
            console.log(xmlHttp.responseText);
            let data = JSON.parse(xmlHttp.responseText);
            let errorString = 'Congratulations, you broke the site! :) \n (Most likely, the problem is this: ' + data.message + ' )';
            drawResult('', errorString);
        } 
    }
    xmlHttp.open("GET", destinationURL, true);
    xmlHttp.send(null);
}

function drawResult(data, myError) {
    let output = document.getElementById('outputContainerID');
    if (output) {
        output.remove();
    }
    let container
    if (data !== '') {
        container = template({
            place: data.name + ', ' + data.sys.country,
            weather: 'Weather: ' + data.weather[0].main + ' ( ' + data.weather[0].description + ' )',
            temp: 'Temperature: ' + (data.main.temp - 273.15).toFixed(0) + '°C',
            wind: 'Wind: ' + data.wind.speed + ' m/s',
            press: 'Pressure: ' + ((data.main.pressure * 100) / 133.322).toFixed(2) + ' Torr'
        });
    } else {
        container = template({
            errorString: myError,
        });
    }
    
    let body = document.getElementById('body');
    let div = document.createElement('div');
    div.innerHTML = container;
    div.id = 'outputContainerID';

    body.appendChild(div);
}

