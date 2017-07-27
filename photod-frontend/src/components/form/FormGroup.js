// @flow

import React from 'react';

import PropTypes from 'prop-types';

import type { Errors } from './types';

/**
 * Type declaration for Props.
 */
type Props = {
    children: React.Element<*>,
}

/**
 * Type declaration for State.
 */
type State = {
    errors: ?Errors,
}

export default class FormGroup extends React.Component<void, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
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
    constructor(props: Props) {
        super(props);

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
    setErrors(errors: Errors): void {
        this.setState({
            errors,
        });
    }

    /**
     * Clear the errors (if any).
     *
     * @return {void}
     */
    clearErrors(): void {
        this.setState({
            errors: null,
        });
    }

    /**
     * @inheritdoc
     */
    render() {
        return React.Children.only(this.props.children);
    }
}
