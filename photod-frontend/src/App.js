// @flow

import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Albums from 'pages/Albums';
import Directories from 'pages/Directories';
import Locations from 'pages/Locations';
import Login from 'pages/Login';
import People from 'pages/People';
import Settings from 'pages/Settings';
import Tags from 'pages/Tags';
import NotFound from 'pages/NotFound';

import { toGlobalId } from 'graphql-relay';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Directories} />

                    <Route exact path='/login' component={({ history }) => <Login history={history} />} />

                    <Route exact path='/directories' component={Directories } />
                    <Route exact path='/directories/:id' component={
                        ({ match }) => <Directories id={toGlobalId('Directory', match.params.id)} />
                    } />

                    <Route exact path='/albums' component={Albums} />
                    <Route exact path='/albums/:id' component={
                        ({ match }) => <Albums id={toGlobalId('Album', match.params.id)} />
                    } />

                    <Route exact path='/tags' component={Tags} />
                    <Route exact path='/tags/:tag' component={
                        ({ match }) => <Tags tag={match.params.tag} />
                    } />

                    <Route exact path='/people' component={People} />
                    <Route exact path='/people/:id' component={
                        ({ match }) => <People id={toGlobalId('Person', match.params.id)} />
                    } />

                    <Route exact path='/locations' component={Locations} />

                    <Route exact path='/settings' component={Settings} />
                    <Route exact path='/settings/:page' component={
                        ({ match }) => <Settings page={match.params.page} />
                    } />

                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}
