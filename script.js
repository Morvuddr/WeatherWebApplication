let url = 'https://api.openweathermap.org/data/2.5/weather';
let APIkey = 'b50d06cf0be2ceacf57cf97451e6a7af';
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
    let output = document.getElementById('outputContainerID');
    if (output) {
        output.remove();
    }
    document.getElementById("loader").style.display = "block";
    search(cityName).then((result) => {
        drawResult(result);
    });
});

function search(cityName) {
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
}

function drawResult({city , error}) {
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
    let div = document.createElement('div');
    div.innerHTML = container;
    div.id = 'outputContainerID';
    body.appendChild(div);
}

