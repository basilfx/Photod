// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import MediaList from 'components/MediaList';
import Thumbnail from 'components/Thumbnail';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import profile from 'profile';

/**
 * Type declaration for Props.
 */
type Props = {
    directoryId: string,

    loading: boolean,
    hasNextPage: boolean,
    loadMoreEntries: () => void,
    mediaFiles?: Object,

    onSelection?: (Array<any>) => void,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

/**
 * The component.
 */
class DirectoryMediaList extends React.Component<DefaultProps, Props, void> {
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
        if (visible && this.props.hasNextPage && !this.props.loading) {
            this.props.loadMoreEntries();
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        if (this.props.loading) {
            return null;
        }

        return <MediaList onSelection={this.props.onSelection} mediaFiles={this.props.mediaFiles} onLastItem={this.handleLastItem} />;
    }
}

const Query = gql`
    query MediaFiles($cursor: String, $directoryId: ID, $profile: String) {
        mediaFiles(first: 25, after: $cursor, directoryId: $directoryId) {
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
            directoryId: props.directoryId,
            profile: JSON.stringify({
                height: 192,
                quality: profile.quality,
                mimeType: profile.mimeTypes,
            }),
        },
    }),
    props({ data: { loading, mediaFiles, fetchMore } }) {
        return {
            loading,
            mediaFiles,
            hasNextPage: mediaFiles ? mediaFiles.pageInfo.hasNextPage : false,
            loadMoreEntries: () => {
                return fetchMore({
                    variables: {
                        cursor: mediaFiles.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        if (!fetchMoreResult) {
                            return previousResult;
                        }

                        const newEdges = fetchMoreResult.mediaFiles.edges;
                        const pageInfo = fetchMoreResult.mediaFiles.pageInfo;

                        return {
                            mediaFiles: {
                                edges: [...previousResult.mediaFiles.edges, ...newEdges],
                                pageInfo,
                            },
                        };
                    },
                });
            },
        };
    },
})(DirectoryMediaList);
