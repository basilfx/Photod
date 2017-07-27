// @flow

import React from 'react';

import moment from 'moment-timezone';

/**
 * Type declaration for Props.
 */
type Props = {
    format?: string,
    relative?: boolean,
    timestamp: string,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    format: string,
    relative: boolean,
};

/**
 * Format a given timestamp in a human-friendly format.
 *
 * Refer to the documentation of Moment.js (http://momentjs.com/) for the
 * different formatting options.
 *
 * This component takes the timezone from `window.getApplicationTimezone()`.
 */
export default class DateTime extends React.PureComponent<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        format: 'LLL',
        relative: true,
    };

    /**
     * @inheritdoc
     */
    render() {
        const timestamp = this.props.timestamp;

        if (!timestamp) {
            return <span>—</span>;
        }

        let dateTime;

        if (typeof timestamp === 'string') {
            dateTime = moment.tz(timestamp, window.getApplicationTimezone());
        }
        else {
            throw new Error('Timestamp must be an object or a string.');
        }

        const title = dateTime.format(this.props.format);
        const content = this.props.relative ? dateTime.fromNow() : title;

        return (
            <span title={title}>
                {content}
            </span>
        );
    }
}
