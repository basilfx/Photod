// @flow

import React from 'react';

import Spinner from 'ui/Spinner';

/**
 * The component.
 */
export default class Loading extends React.Component<void, void, void> {
    /**
     * @inheritdoc
     */
    render() {
        return (
            <div className='uk-padding-small uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-flex-column'>
                <Spinner size={2} />
            </div>
        );
    }
}
