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

    directoryId: string,
};

/**
 * The component.
 */
class DirectoryMediaList extends React.Component<void, Props, void> {
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

const Query = gql`
    query MediaFiles($after: String, $directoryId: ID!, $profile: String) {
        mediaFiles(first: 1, after: $after, directoryId: $directoryId) {
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

export default graphql(Query, {
    options: (props: Props) => ({
        variables: {
            directoryId: props.directoryId,
            profile: JSON.stringify({
                height: profile.thumbnail.height,
                quality: profile.quality,
                mimeType: profile.mimeTypes,
            }),
        },
    }),
    props: ({ data }) => createConnectionProps(data, 'mediaFiles', fromRelay),
})(DirectoryMediaList);
