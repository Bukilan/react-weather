let axios = require('axios');



module.exports.getWeather = (geodata) => {
    return axios
        .get(`https://api.weather.yandex.ru/v1/forecast?lat=${geodata.latitude}&lon=${geodata.longitude}&lang=ru_RU`, {
            headers: {
                'X-Yandex-API-Key': 'fb2b6f7b-6335-4574-b0e7-382183e4b0c2',
            }
        })
};

module.exports.getLocation = (geodata) => {
    return axios
        .get(`https://api.opencagedata.com/geocode/v1/json?q=${geodata.latitude},${geodata.longitude}&key=7624f1cc1ca743b48d86f16e1a4fd389`)
};
