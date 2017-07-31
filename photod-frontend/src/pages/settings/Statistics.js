// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import profile from 'profile';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    jobs?: Object,
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
class Statistics extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    renderJobs() {
        if (this.props.loading) {
            return null;
        }

        if (!this.props.jobs.length) {
            return <p>No active jobs.</p>
        }

        const jobs = [];

        for (const edge of this.props.jobs) {
            jobs.push(
                <dl key={edge.node.id} className='uk-description-list'>
                    <dt>{edge.node.title}</dt>
                    <dd>
                        <div className='uk-flex'>
                            <progress className='uk-progress' value={edge.node.progress} max={edge.node.items} style={{ maxWidth: '33%' }} />
                            <span style={{ lineHeight: '15px' }}>&nbsp; {Math.round(edge.node.progress / edge.node.items * 100)}%</span>
                        </div>
                    </dd>
                </dl>
            );
        }

        return jobs;
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div className='uk-padding-small'>
                <h4>Current profile</h4>

                <dl className='uk-description-list'>
                    <dt>Minimal quality</dt>
                    <dd>{profile.quality}</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>Preferred MIME-types</dt>
                    <dd>{profile.mimeTypes.join(', ')}</dd>
                </dl>

                <h4>Active jobs</h4>

                {this.renderJobs()}
            </div>
        );
    }
}

const StatisticsQuery = gql`
    query MediaFiles($after: String) {
        jobs(first: 100, after: $after) {
            edges {
                node {
                    id,
                    title,
                    progress
                    items
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export default graphql(StatisticsQuery, {
    props({ data: { loading, jobs, fetchMore } }) {
        return {
            loading,
            jobs: jobs ? jobs.edges : [],
            hasNextPage: jobs ? jobs.pageInfo.hasNextPage : false,
            loadMoreEntries: () => {
                return fetchMore({
                    variables: {
                        cursor: jobs.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        if (!fetchMoreResult) {
                            return previousResult;
                        }

                        const newEdges = fetchMoreResult.jobs.edges;
                        const pageInfo = fetchMoreResult.jobs.pageInfo;

                        return {
                            jobs: {
                                edges: [...previousResult.jobs.edges, ...newEdges],
                                pageInfo,
                            },
                        };
                    },
                });
            },
        };
    },
})(Statistics);
