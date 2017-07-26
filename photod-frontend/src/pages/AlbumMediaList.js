// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import MediaList from 'components/MediaList';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import { fromGlobalId } from 'graphql-relay';

/**
 * Type declaration for Props.
 */
type Props = {
    albumId: string,

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
class AlbumMediaList extends React.Component<DefaultProps, Props, void> {
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

        return (
            <div>
                <MediaList mediaFiles={this.props.mediaFiles} />
                <VisibilitySensor onChange={this.handleLastItem} />
            </div>
        );
    }
}

const MediaFilesQuery = gql`
    query MediaFiles($cursor: String, $albumId: ID) {
        mediaFiles(first: 25, after: $cursor, albumId: $albumId) {
            edges {
                node {
                    id,
                    path,
                    mimeType,
                    fileSize,
                    width,
                    height,
                    faces {
                        edges {
                            node {
                                id,
                                x1,
                                y1,
                                x2,
                                y2,
                                person {
                                      id,
                                      name,
                                }
                            }
                        }
                    }
                    palette(first: 1) {
                        edges {
                            node {
                                color,
                                prominence,
                            }
                        }
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export default graphql(MediaFilesQuery, {
    options: (props) => ({
        variables: {
            albumId: props.albumId,
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
})(AlbumMediaList);
