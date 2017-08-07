// @flow

import { combineReducers } from 'redux';

import application from './application/reducer';
import settings from './settings/reducer';

export default combineReducers({
    application,
    settings,
});
