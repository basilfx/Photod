// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import UIkit from 'uikit';

import type { ComponentClass } from './types';

/**
 * Type declaration for Props.
 */
type Props = {
    className: string,
    componentClass?: ComponentClass,
    icon: string,
    size?: number,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    componentClass: ComponentClass,
    size: number,
};

/**
 * The component.
 */
export default class Icon extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        className: '',
        componentClass: 'span',
        size: 1,
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `${this.props.className}`;
        const props = {
            className: className.trim(),

            'data-uk-icon': `icon: ${this.props.icon}; ratio: ${String(this.props.size)}`,
        };

        return React.createElement(
            String(this.props.componentClass), props
        );
    }
}
