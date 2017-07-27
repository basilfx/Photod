// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import duration from 'format-duration';
import filesize from 'filesize';

/**
 * Type declaration for MediaFileType.
 */
type MediaFileType = {
    id: String,
    path: string,
    name: string,
    mimeType: string,
    recorded: string,
    orientation: number,
    width: number,
    height: number,
    fileSize: number,
    duration: number
};

/**
 * Type declaration for Props.
 */
type Props = {
    mediaFiles?: Array<MediaFileType>,
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
export default class MediaInfo extends React.Component<DefaultProps, Props, void> {
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
        if (!this.props.mediaFiles) {
            return <h4>No media file selected.</h4>;
        }

        if (this.props.mediaFiles.length > 1) {
            return <h4>Multiple files selected.</h4>;
        }

        const mediaFile = this.props.mediaFiles[0];

        const matches = (mimeType) => true;

        return (
            <div>
                <h4>{mediaFile.name}</h4>

                <dl className='uk-description-list'>
                    <dt>MIME-type</dt>
                    <dd>{mediaFile.mimeType}</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>File size</dt>
                    <dd>{filesize(mediaFile.fileSize)}</dd>
                </dl>

                {matches('image/*') && <dl className='uk-description-list'>
                    <dt>Dimensions</dt>
                    <dd>{mediaFile.width}x{mediaFile.height}</dd>
                </dl>}

                {matches('video/*') && <dl className='uk-description-list'>
                    <dt>Duration</dt>
                    <dd>{duration(mediaFile.duration / 1000)}</dd>
                </dl>}

                {false && <dl className='uk-description-list'>
                    <dt>Tags</dt>
                    <dd>vidoe panorama</dd>
                </dl>}

                {false && <dl className='uk-description-list'>
                    <dt>Faces</dt>
                    <dd>2 faces</dd>
                </dl>}

                {false && <dl className='uk-description-list'>
                    <dt>Locations</dt>
                    <dd>3 locations</dd>
                </dl>}
            </div>
        );
    }
}
