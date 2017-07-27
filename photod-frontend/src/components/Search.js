// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import List from 'ui/List';
import ListItem from 'ui/ListItem';
import Icon from 'ui/Icon';
import Navbar from 'ui/Navbar';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import LRU from 'lru-cache';

import { throttle } from 'lodash';

/**
 * Type declaration for a list of SearchResults.
 */
type SearchResults = Array<{
    model: string,
    text: string,
    score: number,
    pk: string,
}>;

/**
 * Type declaration for Props.
 */
type Props = {
    search: (string) => void,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

type State = {
    results: ?SearchResults,
}

/**
 * The component.
 */
class Search extends React.Component<DefaultProps, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

    state: State;

    input: HTMLInputElement;

    close: HTMLAnchorElement;

    cache: LRU;

    search: (string) => Promise<*>;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    /**
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            results: null,
        };

        this.cache = new LRU(100);

        this.search = throttle(this.props.search, 200);
    }

    /**
     * @inheritdoc
     */
    componentDidMount() {
        this.input.addEventListener('keyup', this.handleKeyUp);
        this.input.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * @inheritdoc
     */
    componentWillUnmount() {
        this.input.removeEventListener('keyup', this.handleKeyUp);
        this.input.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Handle the key down event.
     *
     * When the box has focus and no input, close the search bar when escape
     * is pressed.
     */
    @autobind handleKeyDown(event: KeyboardEvent): void {
        const value = this.input.value.trim();

        if (event.keyCode === 27) {
            if (!value) {
                this.close.click();
            }
        }
    }

    @autobind async handleKeyUp(event: KeyboardEvent): Promise<void> {
        const value = this.input.value.trim();

        if (this.input.value) {
            let response;

            // Check if the result is in the cache.
            if (this.cache.has(value)) {
                response = this.cache.get(value);
            }
            else {
                try {
                    response = await this.search(value);
                }
                catch (error) {
                    return;
                }
            }

            // Put it back in the queue (this makes it most recently used).
            this.cache.set(value, response);

            // Update state.
            this.setState({
                results: response.data.search.results,
            });
        }
        else {
            this.setState({
                results: null,
            });
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <Navbar positon='left' className='nav-overlay uk-flex-1' hidden>
                <div className='uk-navbar-item uk-width-expand'>
                    <div className='uk-search uk-search-navbar uk-width-1-1'>
                        <input ref={(element) => { this.input = element; }} className='uk-search-input' type='search' placeholder='Search...' autoFocus />
                    </div>
                </div>

                <a ref={(element) => { this.close = element; }} className='uk-navbar-toggle' data-uk-toggle='target: .nav-overlay; animation: uk-animation-fade' href='#'>
                    <Icon icon='close' size={1} />
                </a>

                {this.state.results && <div style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#ffffff',
                    top: '81px',
                    zIndex: '2000',
                }}>
                    <List>
                        {this.state.results.map((result, index) => (
                            <ListItem key={index} className='uk-padding-small'>
                                {result.model} - {result.text} - {result.score}
                            </ListItem>
                        ))}
                    </List>
                </div>}
            </Navbar>
        );
    }
}

const SearchMutation = gql`
    mutation search($query: String!) {
        search(query: $query) {
            results {
                model
                pk
                score
                text
            }
        }
    }
`;

export default graphql(SearchMutation, {
    props: ({ mutate }) => ({
        search: (query) => mutate({ variables: { query } }),
    }),
})(Search);
