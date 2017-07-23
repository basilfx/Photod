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

};

/**
 * The component.
 */
export default class Favorites extends React.Component<DefaultProps, Props, void> {
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
        /*if (this.props.page === 'interface') {
            return <Interface />;
        }
        else if (this.props.page === 'statistics') {
            return <Statistics />;
        }
        else if (this.props.page === 'about') {
            return <About />;
        }
        else*/ {
            return null;
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        const trail = [
            {
                label: 'Favorites',
            },
        ];

        const menuItems = [
            {
                key: 'starred',
                label: 'Starred',
                component: <Link to={'/favorites/starred'}>Starred</Link>,
            },
            {
                key: 'views',
                label: 'Views',
                component: <Link to={'/favorites/views'}>Views</Link>,
            },
        ];

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='favorites' />}
                        panel={<MenuList items={menuItems} selectedKey={this.props.page} showCount={false} />}
                    />
                }
            >
                {this.renderPage()}
            </Main>
        );
    }
}
