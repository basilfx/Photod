// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import profile from 'profile';

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
export default class Statistics extends React.Component<DefaultProps, Props, void> {
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
            <div className='uk-padding-small'>
                <p className='uk-text-lead'>Current profile</p>

                <dl class='uk-description-list'>
                    <dt>Minimal quality</dt>
                    <dd>{profile.quality}</dd>
                </dl>

                <dl class='uk-description-list'>
                    <dt>Preferred MIME-types</dt>
                    <dd>{profile.mimeTypes.join(', ')}</dd>
                </dl>
            </div>
        );
    }
}
