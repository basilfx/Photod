// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Button from 'ui/Button';

import Form from 'components/form/Form';
import FormGroup from 'components/form/FormGroup';
import Input from 'components/form/Input';

/**
 * Type declaration for Props.
 */
type Props = {
    // children?: any,
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
export default class Interface extends React.Component<DefaultProps, Props, void> {
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
        alert(values)
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div className='uk-padding-small'>
                <Form onValidSubmit={this.handleValidSubmit}>
                    <h3>Menu</h3>

                    <label>
                        <Input type='checkbox' name='autoExpand' /> Auto-expand treeview items with only one child.
                    </label>

                    <h3>Lightbox</h3>

                    <label>
                        <Input type='checkbox' name='lightBox' /> Use black background.
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
