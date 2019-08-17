
import React from "react";
import IsLoading from "./components/isLoading"


import "./static/App.css"

import io from "socket.io-client";


let socket;

if (!socket){
    socket = io('https://bukilan-express-weather.herokuapp.com/')
}


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            weather: {}
        };
    }


    componentDidMount() {
        socket.on('connect', function () {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position.coords.latitude, position.coords.longitude);
                socket.emit('geodata', {
                    latitude: position.coords.latitude,
                    longitude:position.coords.longitude,
                });
            });
        });

        socket.on('weather', (data) => {
            this.setState({
                weather: data
            })
            console.log(data)
        });
    }

    render() {

        if (this.state.weather.temp === undefined) {
            return (
                <div>
                    <IsLoading/>
                </div>
            )
        }


        return (


                 <div className="card">

                     <h1 className="location">
                         {this.state.weather.location}
                     </h1>

                     <div className="card-head">
                         <img className="weather-icon" width={120} src={this.state.weather.icon} alt="weather_ico"/>
                         <div className="card-head-in">
                             <h2 className="weather-time">{this.state.weather.obs_time}</h2>
                             <h1 className="weather-temp">{this.state.weather.temp} °C</h1>
                         </div>

                     </div>

                     <div className="card-body">
                         <h3 className="weather-feels">Temperature feels like: {this.state.weather.feels_like} °C</h3>
                         <h3 className="weather-condition"> Condition: {this.state.weather.condition}</h3>
                         <h3 className="weather-wind"> Wind Speed: {this.state.weather.wind_speed} m/s</h3>
                     </div>
                     <a href={this.state.weather.ya_url} className="weather-more">MORE</a>
                 </div>




        );
    }
}






export default App