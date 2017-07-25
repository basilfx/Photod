// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import SidebarRight from 'components/SidebarRight';
import Menu from 'components/Menu';
import MediaInfo from 'components/MediaInfo';

import DirectoryTreeview from './DirectoryTreeview';
import DirectoryMediaList from './DirectoryMediaList';

// import { gql, graphql } from 'react-apollo';

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

type State = {
    selection?: Array<any>,
};

/**
 * The component.
 */
export default class Directories extends React.Component<DefaultProps, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

    state: State;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    constructor(props: Props) {
        super(props);

        this.state = {
            selection: null,
        };
    }

    @autobind handleSelection(selection: Array<any>) {
        this.setState({
            selection,
        });
    }

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
                        panel={
                            <div className='uk-padding-small'>
                                <DirectoryTreeview directoryId={this.props.id} />
                            </div>
                        }
                    />
                }
                sidebarRight={
                    <SidebarRight
                        panel={
                            <div className='uk-padding-small'>
                                <MediaInfo mediaFiles={this.state.selection} />
                            </div>
                        }
                    />
                }
            >
                {this.props.id && <DirectoryMediaList onSelection={this.handleSelection} directoryId={this.props.id} />}
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
