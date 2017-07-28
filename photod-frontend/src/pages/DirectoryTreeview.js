// @flow

import React from 'react';

import { connect } from 'react-redux';

import ConnectionTreeview from 'components/ConnectionTreeview';

import { Link } from 'react-router-dom';

import Icon from 'ui/Icon';

import { graphql, compose } from 'react-apollo';

import { createConnectionProps, fromRelay } from 'utils/graphql';

import gql from 'graphql-tag';

import { fromGlobalId } from 'graphql-relay';

import { toggle } from 'modules/application/directories/actions';

import type { Props as ConnectionTreeviewProps } from 'components/ConnectionTreeview';
import type { Directory } from 'components/types';

/**
 * Type declaration for Props.
 */
type Props = {
    ...ConnectionTreeviewProps<Directory>,

    directories?: Array<Directory>,

    parentId?: string,
    directoryId: ?string,
};

/**
 * The component.
 */
class DirectoryTreeview extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    render() {
        class DirectoryConnectionTreeview extends ConnectionTreeview<Directory> {}

        return (
            <DirectoryConnectionTreeview
                nodes={((this.props.directories: any): ?Array<Directory>)}
                selectedNodeId={this.props.directoryId}
                renderNode={(node, onToggle, icon) => (
                    <span style={{ whiteSpace: 'nowrap' }}>
                        <a onClick={onToggle}>
                            <Icon icon={icon(node)} />
                        </a>

                        &nbsp;

                        <Link
                            to={`/directories/${fromGlobalId(node.id).id}`}
                            onDoubleClick={onToggle}
                            title={node.fullPath}
                        >
                            {node.name}
                        </Link>

                        &nbsp;

                        ({node.totalMediaFilesCount})
                    </span>
                )}
                renderChildren={node => (
                    <ApolloDirectoryTreeview
                        parentId={node.id}
                        selectedNodeId={this.props.directoryId}
                    />
                )}
                {...this.props}
            />
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
        options: (props: Props) => ({
            variables: {
                parentId: props.parentId,
                collapse: true,
            },
        }),
        props: ({ data }) => createConnectionProps(data, 'directories', fromRelay),
    }),
    connect(
        (state, props: Props) => ({
            expanded: state.application.directories[props.parentId] || {},
        }),
        (dispatch, props: Props) => ({
            toggle(childId) {
                return dispatch(toggle(props.parentId, childId));
            },
        })
    )
)(DirectoryTreeview);

export default ApolloDirectoryTreeview;
