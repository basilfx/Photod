// @flow

import React from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

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
                    <Redirect exact from='/' to='/directories'/>

                    <Route exact path='/login' component={
                        ({ history }) => <Login history={history} />
                    } />

                    <Route exact name='directories' path='/directories/:id?' component={
                        ({ match }) => <Directories key='directories' id={toGlobalId('Directory', match.params.id)} />
                    } />
                    <Route exact path='/albums/:id?' component={
                        ({ match }) => <Albums key='albums' id={toGlobalId('Album', match.params.id)} />
                    } />
                    <Route exact path='/tags/:tag?' component={
                        ({ match }) => <Tags key='tags' tag={match.params.tag} />
                    } />
                    <Route exact path='/people/:id' component={
                        ({ match }) => <People key='people' id={toGlobalId('Person', match.params.id)} />
                    } />
                    <Route exact path='/locations' component={
                        ({ match }) => <Locations key='locations' />
                    } />
                    <Route exact path='/settings/:page?' component={
                        ({ match }) => <Settings key='settings' page={match.params.page} />
                    } />

                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }
}
