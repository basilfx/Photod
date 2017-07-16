// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import { Link } from 'react-router-dom';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';
import AlphaList from 'components/AlphaList';

import TagsMediaList from './TagsMediaList';

import { gql, graphql } from 'react-apollo';

/**
 * Type declaration for Props.
 */
type Props = {
    // children?: any,
    tag?: string,
    loading: boolean,
    hasNextPage: boolean,
    loadMoreEntries: () => void;
    tags?: Object
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
class Tags extends React.Component<DefaultProps, Props, void> {
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
        if (this.props.tags) {
            for (const edge of this.props.tags) {
                yield {
                    key: edge.node.label,
                    label: edge.node.label,
                    component: <Link to={`/tags/${edge.node.label}`}>{edge.node.label}</Link>,
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
                label: 'Tags',
            },
        ];

        if (this.props.tag) {
            trail.push({
                label: this.props.tag,
            });
        }

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='tags' />}
                        panel={<AlphaList items={Array.from(this.renderItems())} selectedKey={this.props.tag} onLastItem={this.onLastItem} />}
                    />
                }
            >
                {this.props.tag && <TagsMediaList tag={this.props.tag} />}
            </Main>
        );
    }
}

const TagsQuery = gql`
    query MediaFiles($cursor: String) {
        tags(first: 100, after: $cursor) {
            edges {
                node {
                    id
                    label
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export default graphql(TagsQuery, {
    props({ data: { loading, tags, fetchMore } }) {
        return {
            loading,
            tags: tags ? tags.edges : [],
            hasNextPage: tags ? tags.pageInfo.hasNextPage : false,
            loadMoreEntries: () => {
                return fetchMore({
                    variables: {
                        cursor: tags.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        if (!fetchMoreResult) {
                            return previousResult;
                        }

                        const newEdges = fetchMoreResult.tags.edges;
                        const pageInfo = fetchMoreResult.tags.pageInfo;

                        return {
                            tags: {
                                edges: [...previousResult.tags.edges, ...newEdges],
                                pageInfo,
                            },
                        };
                    },
                });
            },
        };
    },
})(Tags);
