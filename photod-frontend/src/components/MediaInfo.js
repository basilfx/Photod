// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import duration from 'format-duration';
import filesize from 'filesize';

import type { MediaFile } from './Thumbnail';

/**
 * Type declaration for Props.
 */
type Props = {
    mediaFiles: ?Array<MediaFile>,
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

        const matches = (mimeType) => {
            const source = mediaFile.mimeType.split(';', 1)[0].split('/');
            const target = mimeType.split(';', 1)[0].split('/');

            if (target[0] === source[0] || target[0] === '*') {
                if (target[1] === source[1] || target[1] === '*') {
                    return true;
                }
            }
        };

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

                {mediaFile.facesCount > 0 && <dl className='uk-description-list'>
                    <dt>Faces</dt>
                    <dd>{mediaFile.facesCount}</dd>
                </dl>}

                {mediaFile.locationsCount > 0 && <dl className='uk-description-list'>
                    <dt>Locations</dt>
                    <dd>{mediaFile.locationsCount}</dd>
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
