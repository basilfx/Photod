// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import { connect } from 'react-redux';

import VisibilitySensor from 'react-visibility-sensor';

import { Link } from 'react-router-dom';

import Icon from 'ui/Icon';
import List from 'ui/List';
import ListItem from 'ui/ListItem';

import { graphql, compose } from 'react-apollo';

import { createConnectionProps, fromRelay } from 'utils/graphql';

import { fromGlobalId } from 'graphql-relay';

import gql from 'graphql-tag';

import { toggle } from 'modules/application/directories/actions';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    fetchNext?: () => void,
    directories?: Array<any>,

    directoryId?: string,

    expanded: Object;
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
    static defaultProps = {

    };

    @autobind handleLastItem(visible) {
        if (visible && this.props.fetchNext) {
            this.props.fetchNext();
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
                <List><ListItem>Loading...</ListItem></List>
            );
        }

        if (!this.props.directories) {
            return (
                <List><ListItem>No directories.</ListItem></List>
            );
        }

        const icon = (directory) => {
            if (directory.childrenCount === 0) {
                if (directory.id === this.props.directoryId) {
                    return 'chevron-down';
                }
                else {
                    return 'chevron-right';
                }
            }
            else if (this.props.expanded[directory.id]) {
                return 'minus';
            }
            else {
                return 'plus';
            }
        };

        if (!this.props.directories.length) {
            return <span>No directories</span>;
        }

        return (
            <List className='tm-treeview'>
                {this.props.directories && this.props.directories.map(directory =>
                    <ListItem key={directory.id}>
                        <span style={{ whiteSpace: 'nowrap' }}>
                            <a onClick={() => this.handleClick(directory.id)}>
                                <Icon icon={icon(directory)} />
                            </a>

                            &nbsp;

                            <Link to={`/directories/${fromGlobalId(directory.id).id}`} onDoubleClick={() => this.handleClick(directory.id)} title={directory.fullPath}>
                                {directory.name}
                            </Link>

                            &nbsp;

                            ({directory.totalMediaFilesCount})
                        </span>

                        {directory.childrenCount > 0 && this.props.expanded[directory.id] &&
                            <ApolloDirectoryTreeview parentId={directory.id} directoryId={this.props.directoryId} />
                        }
                    </ListItem>
                )}
                {this.props.fetchNext && <ListItem key={`sensor-${this.props.directories.length}`}>
                    <VisibilitySensor partialVisibility onChange={this.handleLastItem} />
                </ListItem>}
            </List>
        );
    }
}

const Query = gql`
    query Directories($parentId: ID, $after: String, $collapse: Boolean) {
        directories(first: 100, after: $after, parentId: $parentId, collapse: $collapse) {
            edges {
                node {
                    id
                    fullPath
                    name
                    childrenCount
                    totalChildrenCount
                    mediaFilesCount
                    totalMediaFilesCount
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

const ApolloDirectoryTreeview = compose(
    graphql(Query, {
        options: (props) => ({
            variables: {
                parentId: props.parentId,
                collapse: true,
            },
        }),
        props: ({ data }) => createConnectionProps(data, 'directories', fromRelay),
    }),
    connect(
        (state, props) => ({
            expanded: state.application.directories[props.parentId] || {},
        }),
        (dispatch, props) => ({
            toggle(childId) {
                return dispatch(toggle(props.parentId, childId));
            },
        })
    )
)(DirectoryTreeview);

export default ApolloDirectoryTreeview;
