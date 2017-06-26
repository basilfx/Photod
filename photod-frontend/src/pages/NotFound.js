// @flow

import React from 'react';

import Main from 'components/Main';
import Header from 'components/Header';

import Icon from 'ui/Icon';

/**
 * Type declaration for Props.
 */
type Props = {

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
export default class NotFound extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

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
                <div className='uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-flex-column'>
                    <div>
                        <Icon icon='close' size={5} className='uk-margin' />
                    </div>

                    <div className='uk-text-lead'>
                        This page does not exist.
                    </div>
                </div>
            </Main>
        );
    }
}
