// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import type { ComponentClass } from './types';

type NavbarPosition = 'left' | 'center' | 'right';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: any,
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
 * The component.
 */
export default class Template extends React.Component<DefaultProps, Props, void> {
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
