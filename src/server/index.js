const app = require('express')();
const http = require('http').createServer(app);
let io = require('socket.io')(http);

const {getWeather} = require("./service");
const {getLocation} = require("./service");

function timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    return date + ' ' + month + ' ' + hour + ':' + min;
}
console.log(timeConverter(0));

app.get('/', function (req, res) {
    res.send(`<h1>hello</h1>`)
});

io.on('connection', function (socket) {
    socket.on('geodata', function (geodata) {
        console.log(geodata);
        getWeather(geodata)
            .then(doc => {
                let result = doc.data;

                getLocation(geodata)
                    .then(respone => {
                        console.log(respone.data.results[0].components);
                        let respone_obj = {
                            location: `${respone.data.results[0].components.state}, ${respone.data.results[0].components.state_district}, ${respone.data.results[0].components.city}`,
                            ya_url: result.info.url,
                            temp: result.fact.temp,
                            feels_like: result.fact.feels_like,
                            icon: `https://yastatic.net/weather/i/icons/blueye/color/svg/${result.fact.icon}.svg`,
                            condition: result.fact.condition,
                            wind_speed: result.fact.wind_speed,
                            obs_time: timeConverter(result.fact.obs_time),
                        };
                        socket.emit('weather', respone_obj );
                    })
                    .catch(err => console.error(err))


            })
            .catch(err => console.error(err))

    });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, ()=>{console.log(`running on ${PORT}`)});