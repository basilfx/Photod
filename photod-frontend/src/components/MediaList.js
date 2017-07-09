// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import MediaFile from './MediaFile';

import moment from 'moment-timezone';

/**
 * Type declaration for Props.
 */
type Props = {
    mediaFiles: Object,
    groupBy?: string,
    onLastItem?: (boolean) => void;
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
export default class MediaList extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    getGroup(mediaFile) {
        const timestamp = mediaFile.recorded ? mediaFile.recorded : mediaFile.created;

        return moment.tz(timestamp, window.getApplicationTimezone()).format("YYYY-MM-DD");
    }

    * renderMediaFiles(): any {
        let lastGroup;

        if (this.props.mediaFiles) {
            for (const edge of this.props.mediaFiles.edges) {
                const group = this.getGroup(edge.node);

                if (group !== lastGroup) {
                    yield <div key={`group-${group}`} className="uk-text-lead uk-width-1-1">{group}</div>;

                    lastGroup = group;
                }

                yield <MediaFile key={edge.node.id} mediaFile={edge.node} />;
            }
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div>
                <div className='uk-padding-small uk-height-1-1 uk-flex uk-flex-wrap'>
                    {Array.from(this.renderMediaFiles())}
                </div>
                {this.props.onLastItem && <div style={{ height: '50vh', marginTop: '-50vh' }}>
                    <VisibilitySensor partialVisibility onChange={this.props.onLastItem} />
                </div>}
            </div>
        );
    }
}
