import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import DateTime from 'react-datetime';
import _ from 'lodash';
import moment from 'moment';

import {WeatherAPIActions} from '../actions/WeatherAPIActions.js';


const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'h:mm a';

class Widget extends PureComponent {
    static displayName = 'Widget';

    static propTypes = {
        weather_data: PropTypes.object.isRequired
    };

    render() {
        const {weather_data} = this.props;

        const weather_exists = weather_data.weather && weather_data.weather.length > 0;

        return (
            <div className="row widget">
                <div className="col-xs-12 head">
                    <h2>
                        {moment(weather_data.dt_txt).format(TIME_FORMAT)}
                    </h2>
                </div>
                <div className="col-xs-6">
                    {weather_exists &&
                        <img src={`https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${weather_data.weather[0].icon}.png`}/>
                    }
                </div>
                <div className="col-xs-6">
                    <h1>{Math.round(weather_data.main.temp)}°C</h1>
                    {weather_exists &&
                        <h3>{weather_data.weather[0].main}</h3>
                    }
                    {weather_data.wind &&
                        <p>Wind: {weather_data.wind.speed || '0.0'} m/s</p>
                    }
                </div>
            </div>
        );
    };
}

@connect(state => state.WeatherAPIReducer, null, null, {pure: false})
export default class Weather extends PureComponent {
    constructor(props) {
        super(props);

        this.map = null;
        this.marker = null;

        this.state = {
            city: null,
            date: null
        };
    };

    static displayName = 'Weather';

    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.initGoogleMap();
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.fetching && nextProps.fetching)
            this.removeMarker();

        if (nextProps.forecast_data && nextProps.forecast_data.city && !_.isEqual(this.props.forecast_data, nextProps.forecast_data)) {
            const city_data = nextProps.forecast_data.city;
            const city_coord = city_data.coord;
            this.addMarker(city_coord.lat, city_coord.lon, `${city_data.name}, ${city_data.country}`);
        }
    };

    initGoogleMap() {
        // quick fix for 'google is not defined'
        setTimeout(() => {
            this.map = new google.maps.Map(document.getElementById("map"), {
                center: {lat: 0, lng: 0},
                zoom: 2
            });
        }, 500);
    };

    addMarker(lat, lng) {
        this.marker = new google.maps.Marker({
            position: {lat, lng},
            map: this.map
        });

        this.map.setZoom(7);
        this.map.panTo(this.marker.position);
    };

    removeMarker() {
        if (!this.marker) return;

        this.marker.setMap(null);
        this.marker = null;
    };

    validateDate(currentDate) {
        return currentDate.isAfter(moment().subtract(1, 'day')) && currentDate.isBefore(moment().add(4, 'day'));
    };

    submit() {
        this.props.dispatch(WeatherAPIActions.getForecast(this.state.city));
    };

    render() {
        const {city, date} = this.state;
        const {fetching, forecast_data, error} = this.props;

        const forecast_data_for_date = _.filter((forecast_data || {}).list, dt => date === moment(dt.dt_txt).format(DATE_FORMAT));

        return (
            <div className="wrapper">
                <div className="row m-b-15">
                    <div className="col-xs-5">
                        <input type="text" className="form-control" value={city || ''}
                               onChange={e => this.setState({city: e.target.value})}
                               placeholder="Enter city..." disabled={fetching} />
                    </div>
                    <div className="col-xs-5">
                        <DateTime value={moment(date, DATE_FORMAT)} dateFormat={DATE_FORMAT} timeFormat={false}
                                  isValidDate={currentDate => this.validateDate(currentDate)}
                                  inputProps={{
                                      onChange: e => e.stopPropagation(),
                                      placeholder: 'Select date...',
                                      disabled: fetching
                                  }}
                                  onChange={e => this.setState({date: moment(e).format(DATE_FORMAT)})}
                                  viewMode="days" />
                    </div>
                    <div className="col-xs-2">
                        <button type="button" className="btn btn-primary"
                                onClick={e => this.submit()} disabled={!city || !date || fetching}>
                            Submit
                        </button>
                    </div>
                </div>
                {error &&
                    <p className="alert alert-danger no-margins">{error}</p>
                }
                {forecast_data &&
                    <div className="row">
                        {forecast_data.city &&
                            <h3 className="text-center">
                                Weather for {forecast_data.city.name}, {
                                forecast_data.city.country}
                            </h3>
                        }
                        {_.map(forecast_data_for_date, dt =>
                            <div className="col-xs-3" key={dt.dt}>
                                <Widget weather_data={dt} />
                            </div>
                        )}
                    </div>
                }
                <div id="map" style={{width: '100%', height: 300}} />
            </div>
        );
    };
}
