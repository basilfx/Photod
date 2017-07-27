// @flow

import React from 'react';

import Icon from 'ui/Icon';

/**
 * Type declaration for Props.
 */
type Props = {
    size?: number,
};

/**
 * The component.
 */
export default class Spinner extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    render() {
        return (
            <Icon icon='spinner' size={this.props.size} className='uk-spinner' />
        );
    }
}
