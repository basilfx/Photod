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
    tag: string,

    loading: boolean,
    hasNextPage: boolean,
    loadMoreEntries: () => void;
    mediaFiles?: Object
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
class TagsMediaList extends React.Component<DefaultProps, Props, void> {
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

        return <MediaList mediaFiles={this.props.mediaFiles} onLastItem={this.handleLastItem} />;
    }
}

const MediaFilesQuery = gql`
    query MediaFiles($cursor: String, $tag: String, $profile: String) {
        mediaFiles(first: 25, after: $cursor, tag: $tag) {
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

export default graphql(MediaFilesQuery, {
    options: (props) => ({
        variables: {
            tag: props.tag,
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
})(TagsMediaList);
