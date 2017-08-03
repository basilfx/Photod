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

    personId: ?string,
};

/**
 * The component.
 */
class PeopleMediaList extends React.Component<void, Props, void> {
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
    query MediaFiles($after: String, $personId: ID!, $profile: String) {
        mediaFiles(first: 25, after: $after, faces_Person_Id: $personId) {
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
    options: (props) => ({
        variables: {
            personId: props.personId,
            profile: JSON.stringify({
                height: profile.thumbnail.height,
                quality: profile.quality,
                mimeType: profile.mimeTypes,
            }),
        },
    }),
    props: ({ data }) => createConnectionProps(data, 'mediaFiles', fromRelay),
})(PeopleMediaList);
