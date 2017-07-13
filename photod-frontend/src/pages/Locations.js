// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';

import { Map, TileLayer } from 'react-leaflet';

import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

Leaflet.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.1.0/images/';

window.Leaflet = Leaflet;

/**
 * Type declaration for Props.
 */
type Props = {
    // children?: any,
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
export default class Locations extends React.Component<DefaultProps, Props, void> {
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
                label: 'Locations',
            },
        ];

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='locations' />}
                    />
                }
            >
                <Map center={[51.98510, 5.89872]} zoom={9} className='uk-height-1-1'>
                    <TileLayer
                        attribution='&amp;copy <a href=&quot;//osm.org/copyright&quot;>OpenStreetMap</a> contributors'
                        url='//{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                </Map>
            </Main>
        );
    }
}
