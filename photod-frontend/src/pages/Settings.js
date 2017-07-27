// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import { Link } from 'react-router-dom';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';
import AlphaList from 'components/AlphaList';

import About from 'pages/settings/About';
import Interface from 'pages/settings/Interface';
import Profile from 'pages/settings/Profile';
import Shared from 'pages/settings/Shared';
import Statistics from 'pages/settings/Statistics';

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

    };

    renderPage() {
        if (this.props.page === 'interface') {
            return <Interface />;
        }
        else if (this.props.page === 'statistics') {
            return <Statistics />;
        }
        else if (this.props.page === 'about') {
            return <About />;
        }
        else if (this.props.page === 'profile') {
            return <Profile />;
        }
        else if (this.props.page === 'shared') {
            return <Shared />;
        }
        else {
            return null;
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        const menuItems = [
            {
                key: 'profile',
                label: 'Profile',
                component: <Link to='/settings/profile'>Profile</Link>,
            },
            {
                key: 'interface',
                label: 'User interface',
                component: <Link to='/settings/interface'>User Interface</Link>,
            },
            {
                key: 'shared',
                label: 'Shared',
                component: <Link to='/settings/shared'>Shared</Link>,
            },
            {
                key: 'statistics',
                label: 'Statistics',
                component: <Link to='/settings/statistics'>Statistics</Link>,
            },
            {
                key: 'about',
                label: 'About',
                component: <Link to='/settings/about'>About</Link>,
            },
        ];

        const trail = [
            {
                label: 'Settings',
            },
        ];

        if (this.props.page) {
            const menuItem = menuItems.find(menuItem => menuItem.key === this.props.page);

            if (menuItem) {
                trail.push(menuItem);
            }
        }

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='settings' />}
                        panel={<AlphaList groupBy={false} items={menuItems} selectedKey={this.props.page} showCount={false} />}
                    />
                }
            >
                {this.renderPage()}
            </Main>
        );
    }
}
