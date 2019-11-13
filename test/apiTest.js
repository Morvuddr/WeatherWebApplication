chai.should();

describe('API', function () {
    beforeEach(function() {
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);
    });

    afterEach(function() {
        this.xhr.restore();
    });
    it('API call with correct city name', function(done) {
        const expectedResult = {
            city: {
            "coord": {
            "lon": 37.62,
                "lat": 55.75
        },
            "weather": [
            {
                "id": 803,
                "main": "Mist",
                "description": "broken clouds",
                "icon": "04n"
            }
        ],
            "base": "stations",
            "main": {
            "temp": 275.06,
                "pressure": 1028,
                "humidity": 86,
                "temp_min": 273.15,
                "temp_max": 277.15
        },
            "visibility": 10000,
            "wind": {
            "speed": 3,
                "deg": 130
        },
            "clouds": {
            "all": 67
        },
            "dt": 1573666549,
            "sys": {
            "type": 1,
                "id": 6021,
                "country": "US",
                "sunrise": 1573044975,
                "sunset": 1573083021
        },
            "timezone": 10800,
            "id": 524901,
            "name": "Moscow",
            "cod": 200
        },
            error: ''
        };
        const dataJSON = JSON.stringify(expectedResult.city);

        search('Moscow').then((result) => {
            result.should.deep.equal(expectedResult);
            done();
        });

        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJSON);
    });

    it('API call with invalid city name',  function(done) {
        const expectedResult = {
            city: '',
            error: 'Congratulations, you broke the site! :) \n (Most likely, the problem is this: city not found )'
        };
        const dataJSON = JSON.stringify({
            "cod": "404",
            "message": "city not found"
        });

        search('Moscow').then((result) => {
            result.should.deep.equal(expectedResult);
            done();
        });

        this.requests[0].respond(404, { 'Content-Type': 'text/json' }, dataJSON);
    });

});