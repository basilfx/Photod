// @flow

import React from 'react';

import Icon from 'ui/Icon';

/**
 * Type declaration for Props.
 */
type Props = {

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
export default class Loader extends React.Component<DefaultProps, Props, void> {
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
            <Icon icon='spinner' size={5} className='uk-margin uk-spinner' />
        );
    }
}
