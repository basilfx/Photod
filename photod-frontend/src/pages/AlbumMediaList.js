// @flow

import React from 'react';

import ConnectionMediaList from 'components/ConnectionMediaList';
import Thumbnail from 'components/Thumbnail';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import { createConnectionProps, fromRelay } from 'utils/graphql';

import profile from 'profile';

import type {
    Props as ConnectionMediaListProps,
} from 'components/ConnectionMediaList';

/**
 * Type declaration for Props.
 */
type Props = {
    ...ConnectionMediaListProps,

    albumId: string,
};

/**
 * The component.
 */
class AlbumMediaList extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    render() {
        return <ConnectionMediaList {...this.props} />;
    }
}

const Querys = gql`
    query MediaFiles($cursor: String, $albumId: ID, $profile: String) {
        mediaFiles(first: 25, after: $cursor, albums_Id: $albumId) {
            edges {
                node {
                    ...Thumbnail
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
    ${Thumbnail.fragment}
`;

export default graphql(Querys, {
    options: (props: Props) => ({
        variables: {
            albumId: props.albumId,
            profile: JSON.stringify({
                height: profile.thumbnail.height,
                quality: profile.quality,
                mimeType: profile.mimeTypes,
            }),
        },
    }),
    props: ({ data }) => createConnectionProps(data, 'mediaFiles', fromRelay),
})(AlbumMediaList);
