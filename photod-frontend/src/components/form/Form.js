// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import PropTypes from 'prop-types';

import uuid from 'uuid/v4';

import type { Values, Errors, NestedComponent } from './types';

/**
 * Type declaration for Props.
 */
type Props = {
    children: React.Element<*>,
    className?: string,
    name?: string,
    onInvalidSubmit?: (Errors) => any,
    onValidSubmit?: (Values) => any,
    onValues?: (Values) => Values,
};

/**
 * Type declaration for Context.
 */
type Context = {
    form: {
        [string]: NestedComponent,
    },
};

/**
 * The Form component is a versatile component for creating HTML forms using
 * React components. It allows composition, which means that the same form can
 * be standalone or nested.
 *
 * When the form is submitted, values are validated. On successful validation,
 * the `onValidSubmit` is invoked, `onInvalidSubmit` otherwise.
 */
export default class Form extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * Stores all registered inputs and nested forms.
     *
     * @type {Object}
     */
    form: {
        [string]: NestedComponent,
    };

    /**
     * Unique form identifier.
     *
     * @type {string}
     */
    formId: string;

    /**
     * @inheritdoc
     */
    static childContextTypes = {
        form: PropTypes.object,
    };

    /**
     * @inheritdoc
     */
    static contextTypes = {
        form: PropTypes.object,
    };

    /**
     * @inheritdoc
     */
    constructor(props: Props, context: Context) {
        super(props, context);

        this.form = {};
        this.formId = uuid();
    }

    /**
     * @inheritdoc
     */
    getChildContext(): Context {
        return {
            form: this.form,
        };
    }

    /**
     * @inheritdoc
     */
    componentWillMount() {
        if (this.context.form) {
            this.context.form[this.formId] = this;
        }
    }

    /**
     * @inheritdoc
     */
    componentWillUnmount() {
        if (this.context.form) {
            delete this.context.form[this.formId];
        }
    }

    /**
     * Handle the onSubmit callback.
     *
     * When submitted, the form will first validate. If that succeeds, the
     * `onValidSubmit` callback is invoked. If not, the `onInvalidSubmit` is
     * invoked.
     *
     * This method will throw an error if it is invoked from a child form. Use
     * the parent form instead.
     *
     * @return {void}
     */
    @autobind handleSubmit(event?: Event): void {
        if (event) {
            event.preventDefault();
        }

        // You cannot submit a child form, always submit the parent form.
        if (this.context.form) {
            throw new Error(
                'Trying to submit a child form. Submit the parent form ' +
                'instead.'
            );
        }

        // Clear the form errors.
        this.clearErrors();

        // Invoke validation, then pass it on.
        const errors = this.validate();

        if (errors === null) {
            const values = this.getValues();

            if (this.props.onValidSubmit) {
                this.props.onValidSubmit(values);
            }
        }
        else if (errors) {
            this.setErrors(errors);

            // Invoke user method.
            if (this.props.onInvalidSubmit) {
                this.props.onInvalidSubmit(errors);
            }
        }
        else {
            throw new Error(
                `Errors should be null, or an object, got ${String(errors)}.`
            );
        }
    }

    /**
     * Helper for submitting the form.
     *
     * @returns {void}
     */
    submit(): void {
        this.handleSubmit();
    }

    /**
     * Validate the form. This will propagate to each child form.
     *
     * If no validation errors exist, null is returned.
     *
     * @return {?Errors} An object containing the errors, or null otherwise.
     */
    validate(): ?Errors {
        const result = {};

        for (const form of ((Object.values(this.form): any): Array<NestedComponent>)) {
            const errors = form.validate();

            if (errors) {
                if (form.props.name) {
                    result[form.props.name] = errors;
                }
                else {
                    if (typeof errors !== 'object') {
                        throw new Error(
                            'Cannot merge errors with non-object values.'
                        );
                    }

                    Object.assign(result, errors);
                }
            }
        }

        if (Object.keys(result).length === 0) {
            return null;
        }

        return result;
    }

    /**
     * Reset the error state of the form. This will propagate to each child
     * form.
     *
     * @return {void}
     */
    clearErrors(): void {
        for (const form of ((Object.values(this.form): any): Array<NestedComponent>)) {
            form.clearErrors();
        }
    }

    /**
     * Set the form error state. This will propagate to each child form if the
     * key of the error object matches the child form name.
     *
     * @param {Errors} errors Object with errors per field.
     * @return {void}
     */
    setErrors(errors: Errors): void {
        if (typeof errors !== 'object') {
            throw new Error('Form errors must be an object.');
        }

        for (const form of ((Object.values(this.form): any): Array<NestedComponent>)) {
            // Put it in a nested object if form has a name (implies nesting).
            if (form.props.name) {
                if (form.props.name in errors) {
                    form.setErrors(errors[form.props.name]);
                }
            }
            else {
                form.setErrors(errors);
            }
        }
    }

    /**
     * Retrieve the form values, including the form values of each child form.
     *
     * Before the values are returned, the `onValues` callback property is
     * invoked to allow one to modify the return values.
     *
     * @return {Values} Form values per field.
     */
    getValues(): Values {
        const result = {};

        for (const form of ((Object.values(this.form): any): Array<NestedComponent>)) {
            const values = form.getValues();

            // Put it in a nested object if form has a name (implies nesting).
            if (form.props.name) {
                result[form.props.name] = values;
            }
            else {
                if (typeof values !== 'object') {
                    throw new Error(
                        'Cannot merge values with non-object values.'
                    );
                }

                Object.assign(result, values);
            }
        }

        if (this.props.onValues) {
            return this.props.onValues(result);
        }

        return result;
    }

    /**
     * @inheritdoc
     */
    render() {
        if (this.context.form) {
            return (
                <div className={this.props.className}>
                    {this.props.children}
                </div>
            );
        }

        return (
            <form onSubmit={this.handleSubmit} className={this.props.className}>
                {this.props.children}
            </form>
        );
    }
}
