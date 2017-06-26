// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';

import DirectoryTreeview from './DirectoryTreeview';
import DirectoryMediaList from './DirectoryMediaList';

// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';

/**
 * Type declaration for Props.
 */
type Props = {
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
                        panel={<div className='uk-padding-small'><DirectoryTreeview directoryId={this.props.id} /></div>}
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
                    // query: DirectoriesQuery,
                    variables: {
                        parentId,
                        cursor: directories.pageInfo.endCursor,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.data.directories.edges;
                        const pageInfo = fetchMoreResult.data.directories.pageInfo;

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
