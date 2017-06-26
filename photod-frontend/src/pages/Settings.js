// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import { Link } from 'react-router-dom';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';
import MenuList from 'components/MenuList';

/**
 * Type declaration for Props.
 */
type Props = {
    page?: string,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    page: string,
};

/**
 * The component.
 */
export default class Settings extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        page: 'interface',
    };

    /**
     * @inheritdoc
     */
    render() {
        const trail = [
            {
                label: 'Settings',
            },
        ];

        const menuItems = [
            {
                label: 'User interface',
                component: <Link to={'/settings/interface'}>User Interface</Link>,
            },
            {
                label: 'Statistics',
                component: <Link to={'/settings/statistics'}>Statistics</Link>,
            },
            {
                label: 'About',
                component: <Link to={'/settings/about'}>About</Link>,
            },
        ];

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='settings' />}
                        panel={<MenuList items={menuItems} showCount={false} />}
                    />
                }
            />
        );
    }
}
