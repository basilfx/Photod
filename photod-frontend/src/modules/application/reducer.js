// @flow

import { combineReducers } from 'redux';

import albums from './albums/reducer';
import directories from './directories/reducer';

export default combineReducers({
    albums,
    directories,
});
