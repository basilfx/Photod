// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';
import Iconnav from 'ui/Iconnav';
import IconnavItem from 'ui/IconnavItem';
import List from 'ui/List';

import IconListItem from 'components/IconListItem';

import { Link } from 'react-router-dom';

/**
 * Type declaration for Props.
 */
type Props = {
    selectedKey?: string,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    selectedKey: string,
};

/**
 * The component.
 */
export default class Menu extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        selectedKey: '',
    };

    renderMenu() {
        const options = [
            {
                key: 'directories',
                label: 'Directories',
                icon: 'folder',
                to: '/directories',
            },
            {
                key: 'albums',
                label: 'Albums',
                icon: 'album',
                to: '/albums',
            },
            {
                key: 'favorites',
                label: 'Favorites',
                icon: 'heart',
                to: '/favorites',
            },
            {
                key: 'people',
                label: 'People',
                icon: 'users',
                to: '/people',
            },
            {
                key: 'tags',
                label: 'Tags',
                icon: 'tag',
                to: '/tags',
            },
            {
                key: 'locations',
                label: 'Locations',
                icon: 'location',
                to: '/locations',
            },
            {
                key: 'settings',
                label: 'Settings',
                icon: 'cog',
                to: '/settings',
            },
        ];

        return options.map(option =>
            <IconnavItem key={option.key} active={this.props.selectedKey === option.key} className='tm-menu'>
                <Link to={option.to} title={option.label}>
                    <Icon icon={option.icon} size={1.5} />
                </Link>
            </IconnavItem>
        );
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <Iconnav className='uk-text-center uk-margin-remove tm-menu'>
                {this.renderMenu()}
            </Iconnav>
        );
    }
}
