var assert = chai.assert;

describe('API', function () {

    it('API call with correct city name', async () => {
        const { city } = await search('Moscow');
        assert.equal(city.name, 'Moscow');
    });
    it('API call with invalid city name', async () => {
        const expectedError = 'Congratulations, you broke the site! :) \n (Most likely, the problem is this: city not found )';
        const { error } = await search('abcd123');
        assert.equal(error, expectedError);
    });

});