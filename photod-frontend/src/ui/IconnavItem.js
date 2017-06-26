// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import type { ComponentClass } from './types';

/**
 * Type declaration for Props.
 */
type Props = {
    active?: boolean,
    children?: any,
    className: string,
    componentClass?: ComponentClass,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    active: boolean,
    className: string,
    componentClass: ComponentClass,
};

/**
 * The component.
 */
export default class IconnavItem extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        active: false,
        className: '',
        componentClass: 'li',
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `${this.props.active ? 'uk-active' : ''} ${this.props.className}`;
        const props = {
            className,
        };

        return React.createElement(
            String(this.props.componentClass), props, this.props.children
        );
    }
}
