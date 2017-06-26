// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import type { ComponentClass } from './types';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: any,
    className: string;
    componentClass?: ComponentClass,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string;
    componentClass: ComponentClass,
};

/**
 * The component.
 */
export default class NavbarContainer extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        className: '',
        componentClass: 'nav',
    }

    /**
     * @inheritdoc
     */
    render() {
        const className = `uk-navbar-container ${this.props.className}`;
        const props = {
            'data-uk-navbar': true,
            className,
        };

        return React.createElement(
            String(this.props.componentClass), props, this.props.children
        );
    }
}
