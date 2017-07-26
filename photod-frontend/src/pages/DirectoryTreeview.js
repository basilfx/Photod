// @flow

import autobind from 'autobind-decorator';

import { connect } from 'react-redux';

import VisibilitySensor from 'react-visibility-sensor';

import React from 'react';

import { Link } from 'react-router-dom';

import Icon from 'ui/Icon';
import List from 'ui/List';
import ListItem from 'ui/ListItem';

import { graphql, compose } from 'react-apollo';

import { createConnectionProps, fromRelay } from 'utils/graphql';

import queries from './queries';

import { fromGlobalId } from 'graphql-relay';

import { toggle } from 'modules/application/directories/actions';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    hasNext: boolean,
    fetchNext: () => void,
    directories?: Array<any>,

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
    static defaultProps = {

    };

    @autobind handleLastItem(visible) {
        if (visible && !this.props.loading && this.props.hasNext) {
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
                <List>
                    <ListItem>Loading...</ListItem>
                </List>
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
                {this.props.hasNext && <ListItem key={`sensor-${this.props.directories.length}`}>
                    <VisibilitySensor partialVisibility onChange={this.handleLastItem} />
                </ListItem>}
            </List>
        );
    }
}

const ApolloDirectoryTreeview = compose(
    graphql(queries.Directories, {
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
