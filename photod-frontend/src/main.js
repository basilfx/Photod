// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';

import App from './App';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import configureStore from 'modules/configureStore';

/*
 * Create a GraphQL client for data communication.
 */
const networkInterface = createNetworkInterface({
    uri: '/graphql',
    opts: {
        credentials: 'include',
    },
});

const client = new ApolloClient({
    networkInterface,
    shouldBatch: true,
});

/*
 * Create the global store that stores the application state. Components will
 * subscribe to data and changes that relate to this store.
 */
const store = configureStore();

/*
 * Export React for the debugging tools.
 */
if (process.env.NODE_ENV !== 'production') {
    window.React = React;
}

/*
 * Export the store for inspection while debugging.
 */
if (process.env.NODE_ENV !== 'production') {
    window.store = store;
}

/*
 * Mount the application to the DOM.
 */
const render = () => {
    ReactDOM.render((
        <AppContainer>
            <ApolloProvider client={client} store={store}>
                <App />
            </ApolloProvider>
        </AppContainer>
    ), document.getElementById('react'));
}; render();

/*
 * Enable support for hot-reloading the application.
 */
if (module.hot) {
    module.hot.accept('./App', render);
}
