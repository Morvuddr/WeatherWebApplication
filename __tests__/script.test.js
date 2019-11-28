const { drawResult, search } = require('../script');
const { bodyHtml } = require('../setupJest');

describe('drawResult function', () => {
    let city;
    let error;
    beforeEach(() => {
        document.body.innerHTML = bodyHtml;
        city = {
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
                "country": "RU",
                "sunrise": 1573044975,
                "sunset": 1573083021
            },
            "timezone": 10800,
            "id": 524901,
            "name": "Moscow",
            "cod": 200
        };
        error = 'Congratulations, you broke the site! :) \n (Most likely, the problem is this: city not found )';
    });

    test('render error', () => {
        const result = {
            city: '',
            error: error
        };

        drawResult(result);

        const expectedResult =
            ' <div id="myErrorContainer"> Congratulations, you broke the site! :) \n (Most likely, the problem is this: city not found )</div> ' +
            '<div id="place">  </div> ' +
            '<div id="weather"> </div> ' +
            '<div id="temperature"> </div> ' +
            '<div id="wind"> </div> ' +
            '<div id="press"></div>';

        expect(document.getElementById('outputContainerID').innerHTML)
            .toEqual(expectedResult);
    });
    test('render weather', () => {
        const result = {
            city: city,
            error: ''
        };

        drawResult(result);

        const expectedResult =
            ' <div id="myErrorContainer"> </div> ' +
            '<div id="place"> Moscow, RU </div> ' +
            '<div id="weather"> Weather: Mist ( broken clouds )</div> ' +
            '<div id="temperature"> Temperature: 2°C</div> ' +
            '<div id="wind"> Wind: 3 m/s</div> ' +
            '<div id="press">Pressure: 771.07 Torr</div>';

        expect(document.getElementById('outputContainerID').innerHTML)
            .toEqual(expectedResult);
    });
    test('render error after rendered weather', () => {
        const previousRender = document.createElement('div');
        previousRender.id = 'outputContainerID';
        previousRender.innerHTML =
            ' <div id="myErrorContainer"> </div> ' +
            '<div id="place"> Moscow, RU </div> ' +
            '<div id="weather"> Weather: Mist ( broken clouds )</div> ' +
            '<div id="temperature"> Temperature: 2°C</div> ' +
            '<div id="wind"> Wind: 3 m/s</div> ' +
            '<div id="press">Pressure: 771.07 Torr</div>';
        const body = document.getElementById('body');
        body.appendChild(previousRender);

        const result = {
            city: '',
            error: error
        };

        drawResult(result);

        const expectedResult =
            ' <div id="myErrorContainer">' +
            ' Congratulations, you broke the site! :) \n (Most likely, the problem is this: city not found )' +
            '</div> <div id="place">  ' +
            '</div> <div id="weather"> ' +
            '</div> <div id="temperature"> </div> ' +
            '<div id="wind"> </div> ' +
            '<div id="press"></div>';

        expect(document.getElementById('outputContainerID').innerHTML)
            .toEqual(expectedResult);
    });
    test('render weather after rendered error', () => {
        const previousRender = document.createElement('div');
        previousRender.id = 'outputContainerID';
        previousRender.innerHTML =
            ' <div id="myErrorContainer">' +
            ' Congratulations, you broke the site! :) \n (Most likely, the problem is this: city not found )' +
            '</div> <div id="place">  ' +
            '</div> <div id="weather"> ' +
            '</div> <div id="temperature"> </div> ' +
            '<div id="wind"> </div> ' +
            '<div id="press"></div>';

        const body = document.getElementById('body');
        body.appendChild(previousRender);

        const result = {
            city: city,
            error: ''
        };

        drawResult(result);

        const expectedResult =
            ' <div id="myErrorContainer">' +
            ' </div> <div id="place"> Moscow, RU </div> ' +
            '<div id="weather"> Weather: Mist ( broken clouds )</div> ' +
            '<div id="temperature"> Temperature: 2°C</div> ' +
            '<div id="wind"> Wind: 3 m/s</div> ' +
            '<div id="press">Pressure: 771.07 Torr</div>';

        expect(document.getElementById('outputContainerID').innerHTML)
            .toEqual(expectedResult);
    });
});

const createMockXHR = (responseJSON) => {
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        readyState: 4,
        responseText: JSON.stringify(
            responseJSON || {}
        )
    };
    return mockXHR;
};

describe('search function', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;
    let mockXHR = null;

    beforeEach(() => {
        mockXHR = createMockXHR();
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
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

        mockXHR.responseText = JSON.stringify(expectedResult.city);
        mockXHR.status = 200;

        search('Moscow').then((result) => {
            expect(result).toStrictEqual(expectedResult);
            done();
        });

        mockXHR.onreadystatechange();
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

        mockXHR.responseText = dataJSON;
        mockXHR.status = 404;
        search('Moscow').then((result) => {
            expect(result).toStrictEqual(expectedResult);
            done();
        });

        mockXHR.onreadystatechange();

    });
});