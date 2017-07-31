// @flow

import bowser from 'bowser';

import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import Lightbox from './Lightbox';
import Thumbnail from './Thumbnail';

import moment from 'moment-timezone';

import type { MediaFile } from './Thumbnail';

/**
 * Type declaration for Props.
 */
type Props = {
    mediaFiles: Array<MediaFile>,
    groupBy?: string,
    onLastItem?: (boolean) => void;
    onSelection?: ?(Array<MediaFile>) => void,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

/**
 * Type declaration for State.
 */
type State = {
    selected: {
        [string]: boolean
    },
    lightbox: ?number,
};

/**
 * The component.
 */
export default class MediaList extends React.Component<DefaultProps, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    state: State;

    /**
     * Boolean to indicate whether multiple select is enabled.
     *
     * @type {boolean}
     */
    multipleSelect: boolean

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
            selected: {},
            lightbox: null,
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    @autobind handleKeyDown(event: KeyboardEvent) {
        if ((!bowser.mac && event.ctrlKey) || (bowser.mac && event.metaKey)) {
            this.multipleSelect = true;
        }
    }

    @autobind handleKeyUp(event: KeyboardEvent) {
        this.multipleSelect = false;
    }

    @autobind handleSelect(mediaFile: MediaFile): void {
        if (!this.multipleSelect) {
            this.handleDeselectAll();
        }

        const selected = {
            ...this.state.selected,
            [mediaFile.id]: true,
        };

        this.setState({
            selected,
        });

        const mediaFiles = this.props.mediaFiles.filter(
            mediaFile => !!selected[mediaFile.id],
        );

        if (this.props.onSelection) {
            this.props.onSelection(mediaFiles);
        }
    }

    @autobind handleDeselect(mediaFile: MediaFile): void {
        const selected = Object.assign({}, this.state.selected, {
            [mediaFile.id]: false,
        });

        this.setState({
            selected,
        });

        const mediaFiles = this.props.mediaFiles.filter(
            mediaFile => !!selected[mediaFile.id],
        );

        if (this.props.onSelection) {
            this.props.onSelection(mediaFiles);
        }
    }

    @autobind handleDeselectAll() {
        this.setState({
            selected: {},
        });

        if (this.props.onSelection) {
            this.props.onSelection(null);
        }
    }

    @autobind handleLightbox(mediaFile: MediaFile): void {
        const index = this.props.mediaFiles.findIndex(
            mediaFile_ => mediaFile_.id === mediaFile.id
        );

        this.setState({
            lightbox: index,
        });
    }

    @autobind handleLightboxNext(): void {
        if (typeof this.state.lightbox !== 'number') {
            return;
        }

        if ((this.state.lightbox + 1) >= this.props.mediaFiles.length) {
            return;
        }

        this.setState({
            lightbox: this.state.lightbox + 1,
        });
    }

    @autobind handleLightboxPrevious(): void {
        if (typeof this.state.lightbox !== 'number') {
            return;
        }

        if ((this.state.lightbox - 1) === -1) {
            return;
        }

        this.setState({
            lightbox: this.state.lightbox - 1,
        });
    }

    @autobind handleLightboxClose(): void {
        this.setState({
            lightbox: null,
        });
    }

    getGroup(mediaFile: MediaFile): string {
        return moment.tz(
            mediaFile.recorded,
            window.getApplicationTimezone()
        ).format('YYYY-MM-DD');
    }

    * renderMediaFiles(): Generator<React.Element<*>, *, *> {
        let lastGroup;

        for (const mediaFile of this.props.mediaFiles) {
            const group = this.getGroup(mediaFile);

            if (group !== lastGroup) {
                yield (
                    <div key={`group-${group}`} className='uk-text-lead uk-width-1-1'>
                        {group}
                    </div>
                );

                lastGroup = group;
            }

            yield (
                <Thumbnail
                    key={mediaFile.id}
                    selected={this.state.selected[mediaFile.id]}
                    mediaFile={mediaFile}
                    onClick={this.handleSelect}
                    onDoubleClick={this.handleLightbox}
                />
            );
        }
    }

    renderLightbox() {
        let previous = null;
        let next = null;

        if (typeof this.state.lightbox !== 'number') {
            return;
        }

        if (this.state.lightbox > 0) {
            previous = this.handleLightboxPrevious;
        }
        if (this.state.lightbox < (this.props.mediaFiles.length - 1)) {
            next = this.handleLightboxNext;
        }

        const mediaFile = this.props.mediaFiles[this.state.lightbox];

        return (
            <Lightbox
                onPrevious={previous}
                onNext={next}
                onClose={this.handleLightboxClose}
                mediaFile={mediaFile}
            />
        );
    }

    /**
     * @inheritdoc
     */
    render() {
        const mediaFileCount = this.props.mediaFiles.length;

        if (mediaFileCount === 0) {
            return (
                <div className='uk-padding-small'>
                    <h4>No media files to show.</h4>
                </div>
            );
        }

        return (
            <div>
                <div className='uk-padding-small uk-height-1-1 uk-flex uk-flex-wrap'>
                    {Array.from(this.renderMediaFiles())}
                </div>
                {this.props.onLastItem && <div style={{ height: '50%', marginTop: '-50%' }}>
                    <VisibilitySensor minTopValue={1} key={`sensor-${mediaFileCount}`} partialVisibility onChange={this.props.onLastItem} />
                </div>}
                {this.renderLightbox()}
            </div>
        );
    }
}
