// @flow

import React from 'react';

import PropTypes from 'prop-types';

import uuid from 'uuid/v4';

import validator from 'validator';

import type { ErrorHelp, ValidationRule, Values, Errors } from './types';

// Some extra validation rules.
validator.required = val => !validator.isEmpty(val);
validator.isOptionalInt = (val, options) => !val || (val && validator.isInt(val, options));
validator.isChecked = val => val !== null;
validator.notNull = val => val !== null;

/**
 * Type declaration for Props.
 */
type Props = {
    children?: React.Element<*>,
    errorHelp: ErrorHelp,
    getValue: () => Values,
    name: string,
    validate?: string,
};

type Context = {
    form: Object,
    formGroup: Object,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    errorHelp: ErrorHelp,
    validate: string,
};

/**
 * Validatable component.
 *
 * This component registers the presence of input fields to the parent form.
 * This parent form is shared via context.
 *
 * When the form is submitted, it will validate and retrieve each input field
 * value using the `getValue` callback. Compared to the Form component, the
 * input field returns a simple value. This component will then return a value
 * compatible with the Form component.
 *
 * Validation rules and error messages are set via the `validate` and
 * `errorHelp` properties.
 */
export default class Validatable extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    form: Object;

    formId: string;

    /**
     * @inheritdoc
     */
    static contextTypes = {
        form: PropTypes.object.isRequired,
        formGroup: PropTypes.object,
    }

    /**
     * @inheritdoc
     */
    static defaultProps = {
        errorHelp: {},
        validate: '',
    };

    /**
     * @inheritdoc
     */
    constructor(props: Props, context: Context) {
        super(props, context);

        if (!context.form) {
            throw new Error('Validatable requires a form component.');
        }

        this.form = {};
        this.formId = uuid();
    }

    /**
     * @inheritdoc
     */
    componentWillMount() {
        this.context.form[this.formId] = this;
    }

    /**
     * @inheritdoc
     */
    componentWillUnmount() {
        delete this.context.form[this.formId];
    }

    /**
     * Clear the error.
     *
     * @return {void}
     */
    clearErrors(): void {
        if (this.context.formGroup) {
            this.context.formGroup.setErrors(null);
        }
    }

    /**
     * Set the errors.
     *
     * @param {Errors} errors One or multiple errors to show.
     * @return {void}
     */
    setErrors(errors: Errors) {
        if (typeof errors !== 'string') {
            throw new Error('Input field error must be a string.');
        }

        if (this.context.formGroup) {
            this.context.formGroup.setErrors(errors);
        }
    }

    /**
     * Return the value of the child control.
     *
     * This method will invoke the function that is given by
     * `this.props.getValue`.
     *
     * @return {mixed} The value of the child component.
     */
    getValues(): mixed {
        return this.props.getValue();
    }

    /**
     * Return an array of rules to validate the value, based on
     * `this.props.validate`.
     *
     * Each item in the array contains the key name, inverse and parameters. If
     * inverse is true, the outcome will be negated.
     *
     * The name is used as a lookup key for the corresponding error message.
     *
     * @return {Array<ValidationRule>} Array of validation rules.
     */
    getRules(): Array<ValidationRule> {
        if (!this.props.validate) {
            return [];
        }

        const byComma = /,(?![^{}]*})/;
        const byColon = /:(?![^{}]*})/;

        return this.props.validate.split(byComma).map(rule => {
            const parameters = rule.split(byColon);
            let name = parameters.shift();
            const inverse = name[0] === '!';

            if (inverse) {
                name = name.substr(1);
            }

            return {
                name,
                inverse,
                parameters: parameters.map(parameter => {
                    // To support simple single-level maps, check if the
                    // argument start with a '{'. Then parse the entries as
                    // string values.
                    if (parameter[0] === '{') {
                        const result = {};

                        parameter
                            .substr(1, parameter.length - 2)
                            .split(byComma)
                            .forEach(match => {
                                const parts = match.split(byColon);

                                result[parts[0]] = parts[1];
                            });

                        return result;
                    }

                    // The default is to return the value as-is.
                    return parameter;
                }),
            };
        });
    }

    /**
     * Validate the input value.
     *
     * The rules are parsed by the `getRules` method. The value itself is
     * taken from the `getValue` method.
     *
     * @return {?string} Error message if validation failed, or null otherwise.
     */
    validate(): ?string {
        const value = this.getValues();
        const rules = this.getRules();

        for (const rule of rules) {
            if (typeof validator[rule.name] !== 'function') {
                throw new Error(`Invalid input validation rule: ${rule.name}`);
            }

            const result = validator[rule.name](value, ...rule.parameters);

            if (result === rule.inverse) {
                return this.props.errorHelp[rule.name] || 'Validation error';
            }
        }

        return null;
    }

    /**
     * @inheritdoc
     */
    render() {
        return React.Children.only(this.props.children);
    }
}
