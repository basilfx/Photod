// @flow

import React from 'react';

import ListItem from './ListItem';

import type { ComponentClass } from './types';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: React.Element<ListItem>,
    className: string,
    componentClass?: ComponentClass,
    divider?: boolean,
    large?: boolean,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    componentClass: ComponentClass,
    divider: boolean,
    large: boolean,
};

/**
 * The component.
 */
export default class List extends React.Component<DefaultProps, Props, void> {
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
        divider: false,
        large: false,
    };

    /**
     * @inheritdoc
     */
    render() {
        const className = `uk-list ${this.props.large ? 'uk-list-large' : ''} ${this.props.divider ? 'uk-list-divider' : ''} ${this.props.className}`;
        const props = {
            className: className.trim(),
        };

        return React.createElement(
            String(this.props.componentClass), props, this.props.children
        );
    }
}
