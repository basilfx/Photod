// @flow

import React from 'react';

import type { ComponentClass } from './types';

/**
 * Button style definitions.
 */
type ButtonStyle =
    'default' |
    'primary' |
    'secondary' |
    'danger' |
    'text' |
    'link';

/**
 * Button size definitions.
 */
type ButtonSize =
    '' |
    'large';

/**
 * Button type definitions.
 */
type ButtonType = 'button' | 'reset' | 'submit';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: React.Element<*>,
    className: string,
    componentClass?: ComponentClass,
    buttonStyle?: ButtonStyle,
    buttonSize?: ButtonSize,
    onClick?: (Event) => void,
    type?: ButtonType,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    componentClass: ComponentClass,
    buttonStyle: ButtonStyle,
    buttonSize: ButtonSize,
    type: ButtonType,
};

/**
 * The button component.
 *
 * @see https://getuikit.com/docs/button
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
        componentClass: 'button',
        buttonStyle: 'default',
        buttonSize: '',
        type: 'button',
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `uk-button uk-button-${String(this.props.buttonStyle)} uk-button-${String(this.props.buttonSize)} ${this.props.className}`;
        const props = {
            className: className.trim(),
            onClick: this.props.onClick,
            type: this.props.type,
        };

        return React.createElement(
            String(this.props.componentClass), props, this.props.children
        );
    }
}
