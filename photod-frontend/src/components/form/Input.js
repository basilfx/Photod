// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import PropTypes from 'prop-types';

import Validatable from './Validatable';

import type { ErrorHelp } from './types';

/**
 * Different types of inputs.
 */
type InputType = 'text' | 'password' | 'email' | 'radio' | 'checkbox' | 'hidden';

/**
 * Type declaration for Props.
 */
type Props = {
    className: string,
    errorHelp?: ErrorHelp,
    multiple: boolean,
    name: string,
    onChange?: (string, mixed) => void,
    type: InputType,
    validate?: string,
    value?: mixed,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    className: string,
    multiple: boolean,
};

/**
 * Wrapper for FormControl component that adds validation.
 */
export default class Input extends React.Component<DefaultProps, Props, void> {
    /**
     * The rendered input element.
     *
     * @type {HTMLInputElement}
     */
    input: HTMLInputElement;

    /**
     * @inheritdoc
     */
    props: Props;

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
        className: '',
        multiple: false,
    };

    /**
     * Return the values of this control.
     *
     * @return {mixed} Form control value.
     */
    @autobind getValue(): mixed {
        if (this.props.type === 'file') {
            if (this.props.multiple) {
                return this.input.files;
            }

            return this.input.files[0];
        }
        else if (this.props.type === 'checkbox') {
            return this.input.checked;
        }

        return this.input.value;
    }

    /**
     * @inheritdoc
     */
    render() {
        const { errorHelp, name, validate, value, className, onChange, ...props } = this.props;

        // The value of a file input cannot be set.
        if (this.props.type !== 'file') {
            if (this.props.type === 'checkbox') {
                props.checked = !!value;
            }
            else {
                props.value = value;
            }
        }

        // Improve the onChange event, if set.
        if (onChange) {
            props.onChange = event => {
                onChange(name, this.getValue());
            };
        }

        const formGroup = this.context.formGroup;

        const type = this.props.type === 'checkbox' ? 'uk-checkbox' : 'uk-input';
        const newClassName = `${type} ${formGroup && formGroup.state.errors ? 'uk-form-danger' : ''} ${String(className)}`.trim();

        return (
            <Validatable errorHelp={errorHelp} getValue={this.getValue} name={name} validate={validate}>
                <input ref={element => (this.input = element)} className={newClassName} name={name} {...props} />
            </Validatable>
        );
    }
}
