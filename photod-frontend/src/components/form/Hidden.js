// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Validatable from './Validatable';

import type { ErrorHelp } from './types';

type Props = {
    errorHelp: ErrorHelp,
    name: string,
    validate: string,
    value: mixed,
};

/**
 * Hiden value component.
 *
 * Compared to HTML input type hidden, this component won't render a HTML
 * element.
 */
export default class Hidden extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * Return the value of this hidden control
     *
     * @return {mixed} The hidden control value.
     */
    @autobind getValue(): mixed {
        return this.props.value;
    }

    /**
     * @inheritdoc
     */
    render() {
        const { name, validate } = this.props;

        return <Validatable getValue={this.getValue} name={name} validate={validate} />;
    }
}
