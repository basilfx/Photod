// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import type { ComponentClass } from './types';

/**
 * Type declaration for the Navbar position.
 */
type NavbarPosition = 'left' | 'center' | 'right';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: React.Element<*>,
    className: string;
    componentClass?: ComponentClass,
    position?: NavbarPosition,
    hidden?: boolean,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    componentClass: ComponentClass,
    position: NavbarPosition,
    hidden: boolean,
};

/**
 * The Navbar component.
 *
 * @see https://getuikit.com/docs/navbar
 */
export default class Navbar extends React.Component<DefaultProps, Props, void> {
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
        position: 'left',
        hidden: false,
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `uk-navbar-${String(this.props.position)} ${this.props.className}`;

        const props = {
            className: className.trim(),
            hidden: this.props.hidden,
        };

        return React.createElement(
            String(this.props.componentClass), props, this.props.children
        );
    }
}
