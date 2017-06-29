import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {Router, Route, IndexRoute} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import {browserHistory} from 'react-router';
import {Provider} from 'react-redux';

import Weather from './weather/components/Weather.jsx';
import WeatherAPIReducer from './weather/reducers/WeatherAPIReducer.js';


const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

const store = createStoreWithMiddleware(combineReducers({
    WeatherAPIReducer,
    routing: routerReducer
}));

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Weather} />
        </Router>
    </Provider>
), document.getElementById('app'));
