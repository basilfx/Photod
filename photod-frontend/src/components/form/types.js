// @flow

/**
 * Type declaration for Values.
 */
export type Values = mixed | {
    [string]: Values,
};

/**
 * Type declaration for Errors.
 */
export type Errors = string | {
    [string]: Errors,
};

/**
 * Type declaration for NestedComponent.
 */
export type NestedComponent = {
    props: {
        name: string,
    },

    validate: () => Errors;
    clearErrors: () => void;
    setErrors: (Errors) => void;
    getValues: () => mixed,
}

/**
 * Type declaration for ValidationRule.
 */
export type ValidationRule = {
    name: string,
    inverse: boolean,
    parameters: Array<any>,
};

/**
 * Type declaration for ErrorHelp.
 */
export type ErrorHelp = {
    [string]: string,
};
