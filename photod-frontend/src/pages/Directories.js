// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';

import DirectoryTreeview from './DirectoryTreeview';
import DirectoryMediaList from './DirectoryMediaList';

// import { gql, graphql } from 'react-apollo';

/**
 * Type declaration for Props.
 */
type Props = {
    parent: React.Component<*, *, *>,
    id?: string,
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
export default class Directories extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    /**
     * @inheritdoc
     */
    render() {
        const trail = [
            {
                label: 'Directories',
            },
        ];

        if (this.props.id) {
            trail.push({
                label: this.props.id,
            });
        }

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='directories' />}
                        panel={<div className='uk-padding-small'>
                            <DirectoryTreeview parent={this.props.parent} directoryId={this.props.id} />
                        </div>}
                    />
                }
            >
                {this.props.id && <DirectoryMediaList directoryId={this.props.id} />}
            </Main>
        );
    }
}

/*

const DirectoriesQuery = gql`
    query Directories($parentId: Int, $cursor: String) {
        directories(first: 25, after: $cursor, parentId: $parentId) {
            edges {
                node {
                    id,
                    parentId,
                    path
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export default graphql(DirectoriesQuery, {
    options: (props) => ({
        variables: {
            parentId: props.parentId,
        },
    }),
    props({ data: { loading, directories, fetchMore } }) {
        return {
            loading,
            directories,
            hasNextPage: directories && directories.pageInfo.hasNextPage,
            loadMoreEntries: (parentId) => {
                return fetchMore({
                    variables: {
                        cursor: directories.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        if (!fetchMoreResult) {
                            return previousResult;
                        }

                        const newEdges = fetchMoreResult.directories.edges;
                        const pageInfo = fetchMoreResult.directories.pageInfo;

                        return {
                            directories: {
                                edges: [...previousResult.directories.edges, ...newEdges],
                                pageInfo,
                            },
                        };
                    },
                });
            },
        };
    },
})(Directories);
*/
