// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

/**
 * Type declaration for Props.
 */
type Props = {
    // children?: React.Element<*>,
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
export default class About extends React.Component<DefaultProps, Props, void> {
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
        return (
            <div className='uk-padding-small uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-flex-column'>
                <div>
                    <Icon icon='heart' size={5} className='uk-margin' />
                </div>

                <div className='uk-text-lead'>
                    Built by <a href='http://www.basilfx.net/'>Bas Stottelaar</a>
                </div>

                <div>
                    Using Django, React, Apollo and more.
                </div>

                <div className='uk-margin-medium-top'>
                    Version 0.0.1 &mdash; Visit on <a href='#'>Github</a>
                </div>
            </div>
        );
    }
}
