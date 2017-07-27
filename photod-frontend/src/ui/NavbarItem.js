// @flow

import React from 'react';

import type { ComponentClass } from './types';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: React.Element<*>,
    className: string,
    componentClass?: ComponentClass,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    componentClass: ComponentClass,
};

/**
 * The component.
 */
export default class NavbarItem extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        className: '',
        componentClass: 'div',
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `uk-navbar-item ${this.props.className}`;
        const props = {
            className: className.trim(),
        };

        return React.createElement(
            String(this.props.componentClass), props, this.props.children
        );
    }
}
