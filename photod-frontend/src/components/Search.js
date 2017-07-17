// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import List from 'ui/List';
import ListItem from 'ui/ListItem';
import Icon from 'ui/Icon';

import { gql, graphql } from 'react-apollo';

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

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    constructor(props) {
        super(props);

        this.cache = new LRU(100);

        this.state = {
            results: null,
        };

        this.search = throttle(this.props.search, 200);
    }

    componentDidMount() {
        this.input.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        this.input.removeEventListener('keyup', this.handleKeyUp);
    }

    @autobind async handleKeyUp() {
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
            <div className='nav-overlay uk-navbar-left uk-flex-1' hidden>
                <div className='uk-navbar-item uk-width-expand'>
                    <div className='uk-search uk-search-navbar uk-width-1-1'>
                        <input ref={(element) => { this.input = element; }} className='uk-search-input' type='search' placeholder='Search...' autoFocus />
                    </div>
                </div>

                <a className='uk-navbar-toggle' data-uk-toggle='target: .nav-overlay; animation: uk-animation-fade' href='#'>
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
            </div>
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
