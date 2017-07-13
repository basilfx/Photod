// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

import { gql, graphql } from 'react-apollo';

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

        this.state = {
            results: null,
        };
    }

    componentDidMount() {
        this.input.addEventListener('keypress', this.handleKeyPress);
    }

    componentWillUnmount() {
        this.input.removeEventListener('keypress', this.handleKeyPress);
    }

    @autobind async handleKeyPress() {
        if (this.input.value) {
            let response;

            try {
                response = await this.props.search(this.input.value);
            }
            catch (error) {
                return;
            }

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
                    <form className='uk-search uk-search-navbar uk-width-1-1'>
                        <input ref={(element) => { this.input = element; }} className='uk-search-input' type='search' placeholder='Search...' autoFocus />
                    </form>
                </div>

                <a className='uk-navbar-toggle' data-uk-toggle='target: .nav-overlay; animation: uk-animation-fade' href='#'>
                    <Icon icon='close' size={1} />
                </a>

                {this.state.results && <div style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#ffffff',
                    top: '80px',
                    zIndex: '1000',
                }}>
                    <ul>
                        {this.state.results.map(result => (
                            <li>
                                {result.model} - {result.text} - {result.score}
                            </li>
                        ))}
                    </ul>
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
