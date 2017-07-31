// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import { Link } from 'react-router-dom';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';
import AlphaList from 'components/AlphaList';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import { fromGlobalId } from 'graphql-relay';

/**
 * Type declaration for Props.
 */
type Props = {
    id?: string,
    loading: boolean,
    hasNextPage: boolean,
    loadMoreEntries: () => void;
    persons?: mixed
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

/**
 * The component.
 */
class People extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    @autobind onLastItem() {
        if (this.props.hasNextPage && !this.props.loading) {
            this.props.loadMoreEntries();
        }
    }

    * renderItems() {
        if (this.props.persons) {
            for (const edge of this.props.persons) {
                yield {
                    key: edge.node.id,
                    label: edge.node.name,
                    component: <Link to={`/people/${fromGlobalId(edge.node.id).id}`}>{edge.node.name}</Link>,
                };
            }
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        const trail = [
            {
                label: 'people',
            },
        ];

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='people' />}
                        panel={<AlphaList items={Array.from(this.renderItems())} selectedKey={this.props.id} onLastItem={this.onLastItem} />}
                    />
                }
            >

            </Main>
        );
    }
}

const PersonsQuery = gql`
    query MediaFiles($after: String) {
        persons(first: 25, after: $after) {
            edges {
                node {
                    id
                    name
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export default graphql(PersonsQuery, {
    props({ data: { loading, persons, fetchMore } }) {
        return {
            loading,
            persons: persons ? persons.edges : [],
            hasNextPage: persons ? persons.pageInfo.hasNextPage : false,
            loadMoreEntries: () => {
                return fetchMore({
                    variables: {
                        cursor: persons.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        if (!fetchMoreResult) {
                            return previousResult;
                        }

                        const newEdges = fetchMoreResult.persons.edges;
                        const pageInfo = fetchMoreResult.persons.pageInfo;

                        return {
                            persons: {
                                edges: [...previousResult.persons.edges, ...newEdges],
                                pageInfo,
                            },
                        };
                    },
                });
            },
        };
    },
})(People);
