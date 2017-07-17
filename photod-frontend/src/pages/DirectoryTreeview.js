// @flow

import autobind from 'autobind-decorator';

import { connect } from 'react-redux';

import VisibilitySensor from 'react-visibility-sensor';

import React from 'react';

import { Link } from 'react-router-dom';

import Icon from 'ui/Icon';
import List from 'ui/List';
import ListItem from 'ui/ListItem';

import { gql, graphql } from 'react-apollo';

import { fromGlobalId } from 'graphql-relay';

import { toggle } from 'modules/application/directories/actions';


/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    hasNextPage: boolean,
    loadMoreEntries: () => void,
    directories?: Object,
    directoryId?: string,

    expanded: object;
    toggle: (string) => void;
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {

};

/**
 * The component.
 */
class DirectoryTreeview extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    state: State;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    @autobind handleLastItem(visible) {
        if (visible && this.props.hasNextPage && !this.props.loading) {
            this.props.loadMoreEntries();
        }
    }

    @autobind handleClick(childId) {
        this.props.toggle(childId);
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
            else if (this.props.expanded[node.id]) {
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

                        {edge.node.childrenCount > 0 && this.props.expanded[edge.node.id] &&
                            <ReduxDirectoryTreeView parent={this.props.parent} parentId={edge.node.id} directoryId={this.props.directoryId} />
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
        directories(first: 100, after: $cursor, parentId: $parentId) {
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
                        if (!fetchMoreResult) {
                            return previousResult;
                        }

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

const ReduxDirectoryTreeView = connect(
    (state, props) => ({
        expanded: state.application.directories[props.parentId] || {},
    }),
    (dispatch, props) => ({
        toggle(childId) {
            return dispatch(toggle(props.parentId, childId));
        }
    }),
)(ApolloDirectoryTreeview);

export default ReduxDirectoryTreeView;
