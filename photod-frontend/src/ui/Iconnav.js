// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import IconnavItem from './IconnavItem';

import type { ComponentClass } from './types';

/**
 * Type declaration for the Iconnav direction.
 */
type IconnavDirection = 'horizontal' | 'vertical';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: React.Element<IconnavItem>,
    className: string,
    componentClass?: ComponentClass,
    direction?: IconnavDirection,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    componentClass: ComponentClass,
    direction: IconnavDirection,
};

/**
 * The Iconnav component.
 *
 * @see https://getuikit.com/docs/iconnav
 */
export default class Iconnav extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        className: '',
        componentClass: 'ul',
        direction: 'horizontal',
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `uk-iconnav uk-iconnav-${String(this.props.direction)} ${this.props.className}`;
        const props = {
            className: className.trim(),
        };

        return React.createElement(
            String(this.props.componentClass), props, this.props.children
        );
    }
}
