// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

/**
 * Type declaration for Props.
 */
type Props = {
    // children?: React.Element<*>,
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
            null
        );
    }
}
