// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import type { ComponentClass } from './types';

type FontAwesomeSize = 'lg' | '1x' | '2x' | '3x' | '4x' | '5x';

/**
 * Type declaration for Props.
 */
type Props = {
    className: string,
    componentClass?: ComponentClass,
    icon: string,
    size?: FontAwesomeSize,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    componentClass: ComponentClass,
    size: FontAwesomeSize,
};

/**
 * The component.
 */
export default class FontAwesome extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        className: '',
        componentClass: 'i',
        size: '1x',
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `fa fa-${this.props.icon} fa-${String(this.props.size)} ${this.props.className}`;
        const props = {
            className: className.trim(),
        };

        return React.createElement(
            String(this.props.componentClass), props
        );
    }
}
