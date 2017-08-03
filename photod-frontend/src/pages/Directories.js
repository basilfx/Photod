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

import { fromRelay } from 'utils/graphql';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import type { MediaFile, Directory } from 'components/types';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    directory: ?Directory,

    id: ?string,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

type State = {
    selection: ?Array<MediaFile>,
};

/**
 * The component.
 */
class Directories extends React.Component<DefaultProps, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
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

    @autobind handleSelection(selection: Array<MediaFile>) {
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

        if (this.props.directory) {
            trail.push({
                label: this.props.directory.name,
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

const Query = gql`
    query Directory($id: ID!) {
        directory(id: $id) {
            name
            fullPath
        }
    }
`;

export default graphql(Query, {
    skip: (ownProps: Props) => !ownProps.id,
    options: (props: Props) => ({
        variables: {
            id: props.id,
        },
    }),
    props: ({ data, ownProps }) => ({
        loading: data.loading,
        directory: fromRelay(data.directory),
    }),
})(Directories);
