// @flow

import autobind from 'autobind-decorator';

import VisibilitySensor from 'react-visibility-sensor';

import React from 'react';

import { Link } from 'react-router-dom';

import Icon from 'ui/Icon';
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
    directories?: Object,
    directoryId?: string
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
class DirectoryTreeview extends React.Component<DefaultProps, Props, State> {
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
                if (node.id === this.props.directoryId) {
                    return 'chevron-down';
                }
                else {
                    return 'chevron-right';
                }
            }
            else if (this.state.expanded[node.id]) {
                return 'minus';
            }
            else {
                return 'plus';
            }
        };

        if (!this.props.directories.edges.length) {
            return <span>No directories</span>;
        }

        return (
            <List className='tm-treeview'>
                {this.props.directories && this.props.directories.edges.map(edge =>
                    <ListItem key={edge.node.id}>
                        <span style={{ whiteSpace: 'nowrap' }}>
                            <a onClick={() => this.handleClick(edge.node.id)}>
                                <Icon icon={icon(edge.node)} />
                            </a>

                            &nbsp;

                            <Link to={`/directories/${fromGlobalId(edge.node.id).id}`} onDoubleClick={() => this.handleClick(edge.node.id)}>
                                {edge.node.name}
                            </Link>

                            &nbsp;

                            ({edge.node.mediaFilesCount})
                        </span>

                        {edge.node.childrenCount > 0 && this.state.expanded[edge.node.id] &&
                            <ApolloDirectoryTreeview parentId={edge.node.id} directoryId={this.props.directoryId} />
                        }
                    </ListItem>
                )}
                {this.props.hasNextPage && <ListItem key='sensor'><VisibilitySensor onChange={this.handleLastItem} /></ListItem>}
            </List>
        );
    }
}

const DirectoriesQuery = gql`
    query Directories($parentId: ID, $cursor: String) {
        directories(first: 25, after: $cursor, parentId: $parentId) {
            edges {
                node {
                    id
                    path
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

const ApolloDirectoryTreeview = graphql(DirectoriesQuery, {
    options: (props) => ({
        variables: {
            parentId: props.parentId,
        },
    }),
    props({ data: { loading, directories, fetchMore } }) {
        return {
            loading,
            directories,
            hasNextPage: directories && directories.pageInfo.hasNextPage,
            loadMoreEntries: () => {
                return fetchMore({
                    variables: {
                        cursor: directories.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.directories.edges;
                        const pageInfo = fetchMoreResult.directories.pageInfo;

                        return {
                            directories: {
                                edges: [...previousResult.directories.edges, ...newEdges],
                                pageInfo,
                            },
                        };
                    },
                });
            },
        };
    },
})(DirectoryTreeview);

export default ApolloDirectoryTreeview;
