import axios from 'axios';

import {WeatherAPIConstants} from '../Constants.js';


class _WeatherAPIActions {
    getForecast(cityName) {
        return dispatch => {
            dispatch({
                type: WeatherAPIConstants.GET_FORECAST
            });

            axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&mode=json&units=metric&APPID=${WEATHERAPP_ID}`).then(response => {
                dispatch({
                    type: WeatherAPIConstants.GET_FORECAST_SUCCESS,
                    data: response.data
                });
            }).catch(error => {
                dispatch({
                    type: WeatherAPIConstants.GET_FORECAST_FAIL,
                    data: error.response ? error.response.data : {}
                })
            })
        }
    }
}

export const WeatherAPIActions = new _WeatherAPIActions();
