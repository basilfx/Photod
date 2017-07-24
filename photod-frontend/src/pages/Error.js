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
export default class Error extends React.Component<DefaultProps, Props, void> {
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
                label: 'Photod',
            },
        ];

        return (
            <Main header={<Header trail={trail} search={false} />}>
                <div className='uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-flex-column'>
                    <div>
                        <Icon icon='warning' size={5} className='uk-margin' />
                    </div>

                    <div className='uk-text-lead'>
                        An error occurred. Please refresh the page.
                    </div>
                </div>
            </Main>
        );
    }
}
