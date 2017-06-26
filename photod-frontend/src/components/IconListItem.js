// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import ListItem from 'ui/ListItem';

/**
 * Type declaration for Props.
 */
type Props = {
    icon: any,
    children?: any,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

/**
 * The component.
 */
export default class Template extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    /**
     * @inheritdoc
     */
    render() {
        return (
            <ListItem className='uk-padding-small'>
                <span className='uk-margin-small-right'>
                    {this.props.icon}
                </span>
                {this.props.children}
            </ListItem>
        );
    }
}
