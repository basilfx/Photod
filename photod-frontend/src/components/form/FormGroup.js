// @flow

import React from 'react';

import PropTypes from 'prop-types';

import type { Errors } from './types';

type Props = {
    children: React.Element<*>,
}

type State = {
    errors: ?Errors,
}

type Context = {

};

export default class FormGroup extends React.Component<void, Props, State> {
    props: Props;

    state: State;

    /**
     * @inheritdoc
     */
    static childContextTypes = {
        formGroup: PropTypes.object,
    };

    /**
     * @inheritdoc
     */
    constructor(props: Props, context: Context) {
        super(props, context);

        this.state = {
            errors: null,
        };
    }

    /**
     * @inheritdoc
     */
    getChildContext() {
        return {
            formGroup: this,
        };
    }

    /**
     * Set the errors.
     *
     * @param {Errors} errors One or multiple errors to show.
     * @return {void}
     */
    setErrors(errors: Errors) {
        this.setState({
            errors,
        });
    }

    /**
     * @inheritdoc
     */
    render() {
        return React.Children.only(this.props.children);
    }
}
