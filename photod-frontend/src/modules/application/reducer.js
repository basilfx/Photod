// @flow

import { combineReducers } from 'redux';

import albums from './albums/reducer';
import directories from './directories/reducer';
import locations from './locations/reducer';
import panels from './panels/reducer';

export default combineReducers({
    albums,
    directories,
    locations,
    panels,
});
