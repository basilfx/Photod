// @flow

import autobind from 'autobind-decorator';

import VisibilitySensor from 'react-visibility-sensor';

import React from 'react';

import { Link } from 'react-router-dom';

import FontAwesome from 'ui/FontAwesome';
import List from 'ui/List';
import ListItem from 'ui/ListItem';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { fromGlobalId } from 'graphql-relay';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    hasNextPage: boolean,
    loadMoreEntries: () => void,
    albums?: Object,
    albumId?: string
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {

};

type State = {
    expanded: any,
}

/**
 * The component.
 */
class AlbumTreeView extends React.Component<DefaultProps, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

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
            expanded: {},
        };
    }

    @autobind handleLastItem(visible) {
        if (visible && this.props.hasNextPage && !this.props.loading) {
            this.props.loadMoreEntries();
        }
    }

    @autobind handleClick(id) {
        this.setState({
            expanded: Object.assign({}, this.state.expanded, {
                [id]: !this.state.expanded[id],
            }),
        });
    }

    /**
     * @inheritdoc
     */
    render() {
        if (this.props.loading) {
            return (
                <List>
                    <ListItem>Loading...</ListItem>
                </List>
            );
        }

        const icon = (node) => {
            if (node.childrenCount === 0) {
                if (node.id === this.props.albumId) {
                    return 'folder-open';
                }
                else {
                    return 'folder';
                }
            }
            else if (this.state.expanded[node.id]) {
                return 'minus';
            }
            else {
                return 'plus';
            }
        };

        if (!this.props.albums) {
            return <span>No albums</span>;
        }

        return (
            <List>
                {this.props.albums && this.props.albums.edges.map(edge =>
                    <ListItem key={edge.node.id}>
                        <a onClick={() => this.handleClick(edge.node.id)}>
                            <FontAwesome icon={icon(edge.node)} />
                        </a>

                        &nbsp;

                        <Link to={`/albums/${fromGlobalId(edge.node.id).id}`}>
                            {edge.node.name}
                        </Link>

                        &nbsp;

                        ({edge.node.mediaFilesCount})

                        {edge.node.childrenCount > 0 && this.state.expanded[edge.node.id] &&
                            <ApolloAlbumTreeView parentId={edge.node.id} albumId={this.props.albumId} />
                        }
                    </ListItem>
                )}
                {this.props.hasNextPage && <ListItem key='sensor'><VisibilitySensor onChange={this.handleLastItem} /></ListItem>}
            </List>
        );
    }
}

const DirectoriesQuery = gql`
    query Albums($parentId: ID, $cursor: String) {
        albums(first: 25, after: $cursor, parentId: $parentId) {
            edges {
                node {
                    id
                    name
                    childrenCount
                    mediaFilesCount
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

const ApolloAlbumTreeView = graphql(DirectoriesQuery, {
    options: (props) => ({
        variables: {
            parentId: props.parentId,
        },
    }),
    props({ data: { loading, albums, fetchMore } }) {
        return {
            loading,
            albums,
            hasNextPage: albums && albums.pageInfo.hasNextPage,
            loadMoreEntries: () => {
                return fetchMore({
                    variables: {
                        cursor: albums.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.albums.edges;
                        const pageInfo = fetchMoreResult.albums.pageInfo;

                        return {
                            albums: {
                                edges: [...previousResult.albums.edges, ...newEdges],
                                pageInfo,
                            },
                        };
                    },
                });
            },
        };
    },
})(AlbumTreeView);

export default ApolloAlbumTreeView;
