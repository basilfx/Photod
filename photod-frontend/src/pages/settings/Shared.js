// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

import DateTime from 'components/DateTime';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import { fromGlobalId } from 'graphql-relay';

import UIkit from 'uikit';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    shares?: mixed,
    hasNextPage: boolean,
    loadMoreEntries: () => void;
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
class Shared extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    @autobind handleLink(selector) {
        const element = document.querySelector(selector);

        if (element) {
            element.select();

            if (document.execCommand('copy')) {
                UIkit.notification({
                    message: 'Link copied to clipboard.',
                    pos: 'bottom-left',
                    status: 'success',
                });
            }
            else {
                UIkit.notification({
                    message: 'Unable to copy to clipboard.',
                    pos: 'bottom-left',
                    status: 'danger',
                });
            }
        }
    }

    renderRows() {
        if (this.props.loading) {
            return null;
        }

        if (!this.props.shares.length) {
            return (
                <tr>
                    <td colSpan={5} className='uk-text-center'>No media files shared</td>
                </tr>
            );
        }

        const rows = [];

        for (const edge of this.props.shares || []) {
            rows.push(
                <tr key={edge.node.id}>
                    <td>{edge.node.mediaFile.path}</td>
                    <td>{edge.node.views}</td>
                    <td><DateTime timestamp={edge.node.created}/></td>
                    <td><DateTime timestamp={edge.node.expires}/></td>
                    <td>
                        <a onClick={() => this.handleLink(`#share-${fromGlobalId(edge.node.id).id}`)}>
                            <Icon icon='link' />
                        </a>
                        <Icon icon='trash' />

                        <div style={{
                            width: '1px',
                            height: '1px',
                            overflow: 'hidden',
                            opacity: 0,
                        }}>
                            <input id={`share-${fromGlobalId(edge.node.id).id}`} value={`${window.location.origin}${edge.node.url}`} readOnly />
                        </div>
                    </td>
                </tr>
            );
        }

        return rows;
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div className='uk-padding-small'>
                <table className='uk-table uk-table-divider'>
                    <thead>
                        <tr>
                            <th>Media File</th>
                            <th>Views</th>
                            <th>Shared Since</th>
                            <th>Expires</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tfoot>
                        {this.renderRows()}
                    </tfoot>
                </table>
            </div>
        );
    }
}

const SharedQuery = gql`
    query Shared($after: String) {
        shares(first: 100, after: $after) {
            edges {
                node {
                    id
                    mediaFile {
                        path
                    }
                    views
                    created
                    expires
                    url
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export default graphql(SharedQuery, {
    props({ data: { loading, shares, fetchMore } }) {
        return {
            loading,
            shares: shares ? shares.edges : [],
            hasNextPage: shares ? shares.pageInfo.hasNextPage : false,
            loadMoreEntries: () => {
                return fetchMore({
                    variables: {
                        cursor: shares.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        if (!fetchMoreResult) {
                            return previousResult;
                        }

                        const newEdges = fetchMoreResult.shares.edges;
                        const pageInfo = fetchMoreResult.shares.pageInfo;

                        return {
                            shares: {
                                edges: [...previousResult.shares.edges, ...newEdges],
                                pageInfo,
                            },
                        };
                    },
                });
            },
        };
    },
})(Shared);
