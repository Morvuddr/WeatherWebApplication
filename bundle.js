(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let url = 'https://api.openweathermap.org/data/2.5/weather';
let APIkey = 'ea50fc4779b296f0c811b4543f95ed25';
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
        const result = {
            city: '',
            error: 'Congratulations, you broke the site! :) \n (Most likely, the problem is this: city not found )'
        };

        drawResult(result);
    }
    let output = document.getElementById('outputContainerID');
    if (output) {
        output.remove();
    }
    document.getElementById("loader").style.display = "block";
    search(cityName).then((result) => {
        drawResult(result);
    });
});

const search = cityName => {
    return new Promise(function(resolve,reject){
        let destinationURL = url + '?q=' + cityName + '&APPID=' + APIkey;
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                return resolve({ city : JSON.parse(xmlHttp.responseText), error: '' });
            } else if (xmlHttp.readyState === 4 && xmlHttp.status !== 200) {
                console.log(xmlHttp.responseText);
                let data = JSON.parse(xmlHttp.responseText);
                let errorString = 'Congratulations, you broke the site! :) \n (Most likely, the problem is this: ' + data.message + ' )';
                return resolve({ city: '', error: errorString });
            } 
        };
        xmlHttp.open("GET", destinationURL, true);
        xmlHttp.send(null);
    })
};

const drawResult = ({city , error}) => {
    document.getElementById("loader").style.display = "none";
    let container;
    if (city !== '') {
        container = template({
            place: city.name + ', ' + city.sys.country,
            weather: 'Weather: ' + city.weather[0].main + ' ( ' + city.weather[0].description + ' )',
            temp: 'Temperature: ' + (city.main.temp - 273.15).toFixed(0) + '°C',
            wind: 'Wind: ' + city.wind.speed + ' m/s',
            press: 'Pressure: ' + ((city.main.pressure * 100) / 133.322).toFixed(2) + ' Torr'
        });
    } else {
        container = template({
            errorString: error,
        });
    }
    
    let body = document.getElementById('body');
    let previous = document.getElementById('outputContainerID');
    if (previous) {
        previous.innerHTML = container
    } else {
        const div = document.createElement('div');
        div.innerHTML = container;
        div.id = 'outputContainerID';
        body.appendChild(div);
    }
};

exports.search = search;
exports.drawResult = drawResult;


},{}]},{},[1]);
