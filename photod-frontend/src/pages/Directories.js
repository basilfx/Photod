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

// import { graphql } from 'react-apollo';

// import gql from 'graphql-tag';

type MediaFileType = {

};

/**
 * Type declaration for Props.
 */
type Props = {
    id: ?string,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

type State = {
    selection: ?Array<MediaFileType>,
};

/**
 * The component.
 */
export default class Directories extends React.Component<DefaultProps, Props, State> {
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

    @autobind handleSelection(selection: Array<MediaFileType>) {
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
