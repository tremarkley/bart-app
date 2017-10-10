import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';

// ================================

const google = window.google;

const BART_API_KEY = "JPZL-28SS-QJ59-KZ7Y";
//const TEMP_BART_API_KEY = "MW9S-E7SL-26DU-VV8V";

const SAN_FRANCISCO_POSITION = {
    lat: 37.7390,
    lng: -122.279956
};

class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            stations: [],
            startingStation: null,
            endingStation: null,
        };
    }

    componentWillMount() {
        this._fetchStations();
    }

    render() {
        return (
            <div ref="map" className = "map">Loading map...</div>
        );
    }

    componentDidMount() {
        this.map = new google.maps.Map(this.refs.map, {
            center: SAN_FRANCISCO_POSITION,
            zoom: 12
        });

        /*var markers = this.state.stations.map((station) =>  {
            console.log(station);
            const position = { lat: station.gtfs_latitude, lng: station.gtfs_longitude };
            return new google.maps.Marker({
                position: position,
                map: this.map
            });
        });*/
        //console.log(this.state.stations);

        //this.setState({markers: markers});
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.stations !== this.state.stations) {
            var markers = this.state.stations.map((station) =>  {
                const position = { lat: parseFloat(station.gtfs_latitude), lng: parseFloat(station.gtfs_longitude) };
                var marker = new google.maps.Marker({
                    position: position,
                    map: this.map
                });

                marker.addListener('click', this._handleMarkerClick.bind(this, station));
            });
        }
    }

    _handleMarkerClick(station) {
        //event.preventDefault();
        if (!this.state.startingStation) {
            this.setState({ startingStation: station})
        }
        else {
            this.setState({ endingStation: station})
        }
    }

    _fetchStations() {
        $.ajax({
            method: 'GET',
            url: 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + BART_API_KEY + '&json=y',
            success: (stations) => {
                this.setState({ stations: stations.root.stations.station })
            }
        });
    }


}

class RouteBox extends React.Component {

}

ReactDOM.render(
    <Map />,
    document.getElementById('root')
);