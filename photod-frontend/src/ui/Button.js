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
        type: 'button',
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `uk-button uk-button-${String(this.props.buttonStyle)} ${this.props.className}`;
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
