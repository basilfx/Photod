// @flow

import React from 'react';

import PropTypes from 'prop-types';

export default class FormGroup extends React.Component {
    /**
     * @inheritdoc
     */
    static childContextTypes = {
        formGroup: PropTypes.object,
    };

    /**
     * @inheritdoc
     */
    static propTypes = {
        children: PropTypes.node,
    };

    /**
     * @inheritdoc
     */
    constructor(props, context) {
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
     * @param {string} errors One or multiple errors to show.
     * @return {void}
     */
    setErrors(errors) {
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
