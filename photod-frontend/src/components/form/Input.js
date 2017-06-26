// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import PropTypes from 'prop-types';

import Validatable from './Validatable';

/**
 * Wrapper for FormControl component that adds validation.
 */
export default class Input extends React.Component {
    input: HTMLInputElement;

    /**
     * @inheritdoc
     */
    static propTypes = {
        className: PropTypes.string,
        errorHelp: PropTypes.object,
        multiple: PropTypes.bool,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        validate: PropTypes.string,
        value: PropTypes.any,
    }

    /**
     * @inheritdoc
     */
    static contextTypes = {
        formGroup: PropTypes.object,
    };

    /**
     * @inheritdoc
     */
    static defaultProps = {
        multiple: false,
    };

    /**
     * Return the values of this control.
     *
     * @return {object|string} Form control value.
     */
    @autobind getValue() {
        if (this.props.type === 'file') {
            if (this.props.multiple) {
                return this.input.files;
            }

            return this.input.files[0];
        }

        return this.input.value;
    }

    /**
     * @inheritdoc
     */
    render() {
        const { errorHelp, name, validate, value, className, ...props } = this.props;

        // The value of a file input cannot be set.
        if (this.props.type !== 'file') {
            props.value = value;
        }

        const formGroup = this.context.formGroup;
        const newClassName = `uk-input ${formGroup && formGroup.state.errors ? 'uk-form-danger' : ''} ${className}`;

        return (
            <Validatable errorHelp={errorHelp} getValue={this.getValue} name={name} validate={validate}>
                <input ref={element => (this.input = element)} className={newClassName} name={name} {...props} />
            </Validatable>
        );
    }
}
