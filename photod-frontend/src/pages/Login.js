// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';
import Header from 'components/Header';

import Form from 'components/form/Form';
import FormGroup from 'components/form/FormGroup';
import Input from 'components/form/Input';

import Icon from 'ui/Icon';

import UIkit from 'uikit';

import queryString from 'query-string';

/**
 * Type declaration for Props.
 */
type Props = {
    history: Object,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

/**
 * The component.
 */
export default class Login extends React.Component<DefaultProps, Props, void> {
    form: Form;

    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    @autobind async handleValidSubmit(values: any) {
        const form = new FormData();

        form.append('username', values.username);
        form.append('password', values.password);
        form.append('remember', values.remember);

        const response = await fetch('/login', {
            method: 'POST',
            body: form,
            credentials: 'same-origin',
        });

        const data = await response.json();

        if (!data.ok) {
            return UIkit.notification({
                message: 'Login failed',
                pos: 'bottom-left',
                status: 'danger',
            });
        }

        // Forward to next page.
        const search = queryString.parse(location.search);

        UIkit.notification({
            message: 'Welcome back!',
            pos: 'bottom-left',
            status: 'success',
        });

        this.props.history.push(search.next || '/');
    }

    /**
     * @inheritdoc
     */
    render() {
        const trail = [
            {
                label: 'photod',
            },
        ];

        return (
            <Main header={<Header trail={trail} search={false} />}>
                <div className='uk-height-1-1 uk-flex uk-flex-center uk-flex-middle'>
                    <div className='uk-card uk-card-default uk-text-center uk-padding' style={{ width: '320px' }}>
                        <Icon icon='camera' size={5} className='uk-margin' />

                        <Form ref={element => { this.form = element; }} onValidSubmit={this.handleValidSubmit}>
                            <div className='uk-margin'>
                                <FormGroup>
                                    <Input className='uk-input uk-form-large' type='text' name='username' placeholder='Username' validate='required' errorHelp={{ required: 'Username is required.' }} />
                                </FormGroup>
                            </div>
                            <div className='uk-margin'>
                                <FormGroup>
                                    <Input className='uk-input uk-form-large' type='password' name='password' placeholder='Password' validate='required' errorHelp={{ required: 'Password is required.' }} />
                                </FormGroup>
                            </div>
                            <div className='uk-margin'>
                                <button type='submit' className='uk-width-1-1 uk-button uk-button-primary uk-button-large'>
                                    Login
                                </button>
                            </div>
                            <div className='uk-margin uk-text-small'>
                                <label className='uk-float-left'><Input className='uk-checkbox' type='checkbox' name='remember' /> Remember Me</label>
                                {false && <a className='uk-float-right uk-link uk-link-muted' href='#'>Forgot Password?</a>}
                            </div>
                        </Form>
                    </div>
                </div>
            </Main>
        );
    }
}
