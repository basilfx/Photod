// @flow

export type Values = mixed | {
    [string]: Values,
};

export type Errors = string | {
    [string]: Errors,
};

export type OtherForm = {
    props: {
        name: string,
    },

    validate: () => Errors;
    clearErrors: () => void;
    setErrors: (Errors) => void;
    getValues: () => mixed,
}

export type ValidationRule = {
    name: string,
    inverse: boolean,
    parameters: Array<any>,
};

export type ErrorHelp = {
    [string]: string,
};
