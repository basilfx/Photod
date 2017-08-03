// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';

import AlbumTreeview from './AlbumTreeview';
import AlbumMediaList from './AlbumMediaList';

import { fromRelay } from 'utils/graphql';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import type { MediaFile, Album } from 'components/types';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    album: ?Album,

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
class Albums extends React.Component<DefaultProps, Props, void> {
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

        if (this.props.album) {
            trail.push({
                label: this.props.album.name,
            });
        }

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

const Query = gql`
    query Album($id: ID!) {
        album(id: $id) {
            name
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
        album: fromRelay(data.album),
    }),
})(Albums);
