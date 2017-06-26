// @flow

import autobind from 'autobind-decorator';

import PropTypes from 'prop-types';

import React from 'react';

import Validatable from './Validatable';

/**
 * Hiden value component.
 *
 * Compared to HTML input type hidden, this component won't render a HTML
 * element.
 */
export default class Hidden extends React.Component {
    /**
     * @inheritdoc
     */
    static propTypes = {
        children: PropTypes.node,
        errorHelp: PropTypes.object,
        name: PropTypes.string.isRequired,
        validate: PropTypes.string,
        value: PropTypes.any,
    }

    /**
     * Return the value of this hidden control
     *
     * @return {any} The hidden control value.
     */
    @autobind getValue() {
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
