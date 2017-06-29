import {WeatherAPIConstants} from '../Constants.js';


const initialState = {
    fetching: false,
    forecast_data: null,
    error: ''
};

export default (state=initialState, action) => {
    switch (action.type) {
        case WeatherAPIConstants.GET_FORECAST:
            state = {
                fetching: true,
                forecast_data: null,
                error: ''
            };
            break;

        case WeatherAPIConstants.GET_FORECAST_SUCCESS:
            state.forecast_data = action.data;
            state.fetching = false;
            break;

        case WeatherAPIConstants.GET_FORECAST_FAIL:
            state.error = action.data.message || 'Internal Server Error';
            state.fetching = false;
            break;
    }

    return state;
}
