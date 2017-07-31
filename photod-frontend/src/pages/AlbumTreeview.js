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
import type { Album } from 'components/types';

/**
 * Type declaration for Props.
 */
type Props = {
    ...ConnectionTreeviewProps<Album>,

    albums?: Array<Album>,

    parentId?: string,
    albumId: ?string,
};

/**
 * The component.
 */
class AlbumTreeview extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    render() {
        class AlbumConnectionTreeview extends ConnectionTreeview<Album> {}

        return (
            <AlbumConnectionTreeview
                nodes={((this.props.albums: any): ?Array<Album>)}
                selectedNodeId={this.props.albumId}
                renderNode={(node, onToggle, icon) => (
                    <span style={{ whiteSpace: 'nowrap' }}>
                        <a onClick={onToggle}>
                            <Icon icon={icon(node)} />
                        </a>

                        &nbsp;

                        <Link
                            to={`/albums/${fromGlobalId(node.id).id}`}
                            onDoubleClick={onToggle}
                        >
                            {node.name}
                        </Link>

                        &nbsp;

                        ({node.totalMediaFilesCount})
                    </span>
                )}
                renderChildren={node => (
                    <ApolloAlbumTreeview
                        parentId={node.id}
                        selectedNodeId={this.props.albumId}
                    />
                )}
                {...this.props}
            />
        );
    }
}

const Query = gql`
    query Albums($parentId: ID, $after: String) {
        albums(first: 100, after: $after, parentId: $parentId) {
            edges {
                node {
                    id
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

const ApolloAlbumTreeview = compose(
    graphql(Query, {
        options: (props: Props) => ({
            variables: {
                parentId: props.parentId,
            },
        }),
        props: ({ data }) => createConnectionProps(data, 'albums', fromRelay),
    }),
    connect(
        (state, props: Props) => ({
            expanded: state.application.albums[props.parentId] || {},
        }),
        (dispatch, props: Props) => ({
            toggle(childId) {
                return dispatch(toggle(props.parentId, childId));
            },
        })
    )
)(AlbumTreeview);

export default ApolloAlbumTreeview;
