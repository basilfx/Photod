// @flow

import autobind from 'autobind-decorator';

import { connect } from 'react-redux';

import React from 'react';

import Button from 'ui/Button';

import Form from 'components/form/Form';
import FormGroup from 'components/form/FormGroup';
import Input from 'components/form/Input';

import { set } from 'modules/settings/actions';

import UIkit from 'uikit';

import type { Values } from 'components/form/types';

/**
 * Type declaration for Props.
 */
type Props = {
    settings: {
        [string]: mixed,
    },
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {

};

/**
 * Type declaration for State.
 */
type State = {
    [string]: mixed,
};

/**
 * The component.
 */
class Interface extends React.Component<DefaultProps, Props, State> {
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
    static defaultProps = {

    };

    /**
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            'application.menu.autoExpand':
                props.settings['application.menu.autoExpand'],
            'application.mediaList.hoverShadow':
                props.settings['application.mediaList.hoverShadow'],
            'application.lightbox.blur':
                props.settings['application.lightbox.blur'],
        };
    }

    /**
     * Handle form field change.
     */
    @autobind handleChange(name: string, value: mixed) {
        this.setState({
            [name]: value,
        });
    }

    /**
     * Handle form submission.
     *
     * This will persist the settings.
     */
    @autobind handleValidSubmit(values: Values): mixed {
        this.props.set(values);

        return UIkit.notification({
            message: 'Settings saved.',
            pos: 'bottom-left',
            status: 'success',
        });
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div className='uk-padding-small'>
                <Form onValidSubmit={this.handleValidSubmit}>
                    <h4>Menu</h4>

                    <label>
                        <Input type='checkbox' name='application.menu.autoExpand' onChange={this.handleChange} value={this.state['application.menu.autoExpand']} /> Auto-expand treeview items with only one child.
                    </label>

                    <h4>Media list</h4>

                    <label>
                        <Input type='checkbox' name='application.mediaList.hoverShadow' onChange={this.handleChange} value={this.state['application.mediaList.hoverShadow']} /> Disable shadow effect on hover.
                    </label>

                    <h4>Lightbox</h4>

                    <label>
                        <Input type='checkbox' name='application.lightbox.blur' onChange={this.handleChange} value={this.state['application.lightbox.blur']} /> Add blur background.
                    </label>

                    <p>
                        <Button buttonStyle='primary' type='submit'>
                            Save
                        </Button>
                    </p>
                </Form>
            </div>
        );
    }
}

export default connect(
    (state, props: Props) => ({
        settings: state.settings,
    }),
    (dispatch, props: Props) => ({
        set(settings) {
            return dispatch(set(settings));
        },
    })
)(Interface);
