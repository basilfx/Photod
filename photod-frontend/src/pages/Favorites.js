// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import { Link } from 'react-router-dom';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';
import AlphaList from 'components/AlphaList';

import Shared from 'pages/favorites/Shared';
import Starred from 'pages/favorites/Starred';
import Views from 'pages/favorites/Views';

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
        if (this.props.page === 'starred') {
            return <Starred />;
        }
        else if (this.props.page === 'views') {
            return <Views />;
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
                key: 'starred',
                label: 'Starred',
                component: <Link to={'/favorites/starred'}>Starred</Link>,
            },
            {
                key: 'views',
                label: 'Views',
                component: <Link to={'/favorites/views'}>Views</Link>,
            },
            {
                key: 'shared',
                label: 'Shared',
                component: <Link to={'/favorites/shared'}>Shared</Link>,
            },
        ];

        const trail = [
            {
                label: 'Favorites',
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
                        menu={<Menu selectedKey='favorites' />}
                        panel={<AlphaList groupBy={false} items={menuItems} selectedKey={this.props.page} showCount={false} />}
                    />
                }
            >
                {this.renderPage()}
            </Main>
        );
    }
}
