import { createStore, applyMiddleware, compose } from 'redux';

import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import ensureFSAMiddleware from '@meadow/redux-ensure-fsa';
import { createLogger } from 'redux-logger';

import reducer from './reducer';

/**
 * Configure the store for this application.
 *
 * This method create a new store that adds the Thunk and Promise middleware.
 * When development is toggled, it will also add middleware for checking if
 * actions are FSA-compliant and to add logging.
 *
 * @param {object} initialState Initial application state.
 * @return {Store} The configured store.
 */
export default function configureStore(initialState) {
    const middlewares = [
        thunkMiddleware,
        promiseMiddleware,
    ];

    // Add some middleware in development only.
    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(ensureFSAMiddleware({
            ignore: () => false,
        }));

        middlewares.push(createLogger({
            collapsed: true,
        }));
    }

    let middleware = applyMiddleware(...middlewares);

    // Add debug tools in development only.
    if (process.env.NODE_ENV !== 'production') {
        middleware = compose(
            middleware,
            window.devToolsExtension ? window.devToolsExtension() : f => f
        );
    }

    const store = createStore(
        reducer, initialState, middleware
    );

    // Enable hot reloading of root reducer.
    if (module.hot) {
        module.hot.accept('./reducer', () => {
            store.replaceReducer(reducer);
        });
    }

    return store;
}
