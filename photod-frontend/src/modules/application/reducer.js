// @flow

import { combineReducers } from 'redux';

import albums from './albums/reducer';
import directories from './directories/reducer';
import locations from './locations/reducer';

export default combineReducers({
    albums,
    directories,
    locations,
});
