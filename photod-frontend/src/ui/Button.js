// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import type { ComponentClass } from './types';

/**
 * Button style definitions.
 *
 * @see https://getuikit.com/docs/button
 */
type ButtonStyle =
    'default' |
    'primary' |
    'secondary' |
    'danger' |
    'text' |
    'link';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: any,
    className: string,
    componentClass?: ComponentClass,
    buttonStyle?: ButtonStyle,
    onClick?: (e) => void,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    componentClass: ComponentClass,
    buttonStyle: ButtonStyle,
};

/**
 * The component.
 */
export default class Button extends React.Component<DefaultProps, Props, void> {
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
        buttonStyle: 'default',
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `uk-button uk-button-${String(this.props.buttonStyle)} ${this.props.className}`;
        const props = {
            className: className.trim(),
            onClick: this.props.onClick,
        };

        return React.createElement(
            String(this.props.componentClass), props, this.props.children
        );
    }
}
