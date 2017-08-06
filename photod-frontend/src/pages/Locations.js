// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';

import Loading from 'components/Loading';

import Loadable from 'react-loadable';

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
 * Loadable version of the map, for bundle splitting.
 *
 * @type React.Component<*, *, *>
 */
const LoadableMap = Loadable({
    loader: () => import('components/Map'),
    loading: Loading,
});

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
                <LoadableMap />
            </Main>
        );
    }
}
