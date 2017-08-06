// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import { Map as LeafletMap, TileLayer } from 'react-leaflet';

import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

Leaflet.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.1.0/images/';

/**
 * Type declaration for Props.
 */
type Props = {
    // children?: React.Element<*>,
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
        return (
            <LeafletMap center={[51.98510, 5.89872]} zoom={9} className='uk-height-1-1'>
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={`${document.location.protocol}//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                />
            </LeafletMap>
        );
    }
}
