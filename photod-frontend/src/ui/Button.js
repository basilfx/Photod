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
 * Button type definitions.
 *
 * @see https://www.w3schools.com/tags/att_button_type.asp
 */
type ButtonType = 'button' | 'reset' | 'submit';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: any,
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
