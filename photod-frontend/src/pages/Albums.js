// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';

import AlbumTreeview from './AlbumTreeview';
import AlbumMediaList from './AlbumMediaList';

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
export default class Albums extends React.Component<DefaultProps, Props, void> {
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
                label: 'Albums',
            },
        ];

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='albums' />}
                        panel={<div className='uk-padding-small'><AlbumTreeview albumId={this.props.id}/></div>}
                    />
                }
            >
                {this.props.id && <AlbumMediaList albumId={this.props.id} />}
            </Main>
        );
    }
}
