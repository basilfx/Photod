// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

import duration from 'format-duration';
import filesize from 'filesize';

import gql from 'graphql-tag';

import type { MediaFile as BaseMediaFile } from './types';

/**
 * Type declaration for MediaFile.
 */
export type MediaFile = BaseMediaFile & {
    name: ?string,
    recorded: ?string,
    orientation: ?number,
    width: ?number,
    height: ?number,
    fileSize: ?number,
    duration: ?number
};

/**
 * Type declaration for Props.
 */
type Props = {
    height: number,
    mediaFile: MediaFile,
    onClick?: (MediaFile) => void,
    onDoubleClick?: (MediaFile) => void,
    selected?: boolean
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    height: number,
    selected: boolean,
}

/**
 * Type declaration for MediaFileParser.
 */
type MediaFileParser = {
    src: string,
    backgroundColor: string,
    width: number,
    height: number,
    frames: number,
    label: any,
    orientation: number,
};

/**
 * Media file thumbnail component.
 */
export default class Thumbnail extends React.Component<DefaultProps, Props, void> {
    parseMediaFile: () => MediaFileParser;

    props: Props;

    thumbnail: HTMLDivElement;

    container: HTMLDivElement;

    image: HTMLDivElement;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        height: 240,
        selected: false,
    }

    static fragment: mixed;

    /**
     * Mapping between MIME-types and render methods.
     *
     * @type {Array}
     */
    static parsers = [
        {
            mimeType: 'image/*',
            parser: 'parseImage',
        },
        {
            mimeType: 'video/*',
            parser: 'parseVideo',
        },
        {
            mimeType: '*/*',
            parser: 'parseUnknown',
        },
    ];

    /**
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        // Determine which method will render the media file, based on the
        // MIME-type.
        const source = this.props.mediaFile.mimeType.split(';', 1)[0].split('/');

        for (const parser of Thumbnail.parsers) {
            const target = parser.mimeType.split(';', 1)[0].split('/');

            if (target[0] === source[0] || target[0] === '*') {
                if (target[1] === source[1] || target[1] === '*') {
                    // $FlowFixMe
                    this.parseMediaFile = this[parser.parser];
                    break;
                }
            }
        }
    }

    /**
     * @inheritdoc
     */
    componentDidMount() {
        this.thumbnail.addEventListener('click', this.handleClick);
        this.thumbnail.addEventListener('dblclick', this.handleDoubleClick);
        window.addEventListener('resize', this.handleResize);

        this.handleResize();
    }

    /**
     * @inheritdoc
     */
    componentWillUnmount() {
        this.thumbnail.removeEventListener('click', this.handleClick);
        this.thumbnail.removeEventListener('dblclick', this.handleDoubleClick);
        window.removeEventListener('resize', this.handleResize);
    }

    @autobind handleClick(event: MouseEvent): void {
        if (this.props.onClick) {
            this.props.onClick(this.props.mediaFile);
        }
    }

    @autobind handleDoubleClick(event: MouseEvent): void {
        if (this.props.onDoubleClick) {
            this.props.onDoubleClick(this.props.mediaFile);
        }
    }

    @autobind handleResize() {
        const info = this.parseMediaFile();

        if (info.orientation === 90 || info.orientation === 270) {
            const rect = this.thumbnail.getClientRects();

            this.image.style.transform = `rotate(${info.orientation}deg)`;
            this.image.style.transformOrigin = `${rect[0].width / 2}px`;
            this.image.style.width = `${rect[0].height}px`;
            this.image.style.height = `${rect[0].width}px`;

            this.container.style.width = `${rect[0].width}px`;
            this.container.style.height = `${rect[0].height}px`;
        }
    }

    /**
     * Render the media file as an image component.
     *
     * @return {MediaFileParser} An image component.
     */
    parseImage(): MediaFileParser {
        const mediaFile = this.props.mediaFile;
        const thumbnails = mediaFile.thumbnails;

        return {
            src: thumbnails.length ? thumbnails[0].url : this.props.mediaFile.url,
            backgroundColor: mediaFile.palette.length ? mediaFile.palette[0].color : '#fff',
            width: mediaFile.width || 0,
            height: mediaFile.height || 0,
            frames: 1,
            orientation: mediaFile.orientation || 0,
            label: (
                <span>
                    <Icon icon='image' /> {mediaFile.width}x{mediaFile.height}, {filesize(mediaFile.fileSize)}, {1 || mediaFile.faces.length} faces
                </span>
            ),
        };
    }

    /**
     * Render the media file as a video component.
     *
     * @return {MediaFileParser} A video component.
     */
    parseVideo(): MediaFileParser {
        const mediaFile = this.props.mediaFile;
        const filmstrips = mediaFile.filmstrips;

        return {
            src: filmstrips.length ? filmstrips[0].url : require('images/filmstrip.svg'),
            backgroundColor: '#ffffff',
            width: filmstrips[0].width / filmstrips[0].frames,
            height: filmstrips[0].height,
            frames: filmstrips[0].frames,
            orientation: 0,
            label: (
                <span>
                    <Icon icon='video-camera' /> {duration(mediaFile.duration / 1000)}, {filesize(mediaFile.fileSize)}
                </span>
            ),
        };
    }

    /**
     * Render the media file as a unknown media file.
     *
     * @return {MediaFileParser} A unknown media component.
     */
    parseUnknown(): MediaFileParser {
        return {
            src: require('images/no_image.svg'),
            backgroundColor: '#ffffff',
            width: 0,
            height: 0,
            frames: 1,
            orientation: 0,
            label: <span />,
        };
    }

    /**
     * @inheritdoc
     */
    render() {
        const info = this.parseMediaFile();

        // Swap width and height depending on orientation.
        let width = info.width;
        let height = info.height;

        if (info.orientation === 90 || info.orientation === 270) {
            width = info.height;
            height = info.width;
        }

        return (
            <div
                ref={element => { this.thumbnail = element; }}
                className={`uk-card uk-card-default uk-card-hover tm-thumbnail ${this.props.selected ? 'tm-thumbnail-selected' : ''}`}
                style={{
                    flexGrow: `${width / height * 100}`,
                    flexBasis: `${width * this.props.height / height}px`,
                    maxHeight: `${this.props.height * 1.25}px`,
                    maxWidth: `${this.props.height * 1.25 * (width / height)}px`,
                    backgroundColor: info.backgroundColor,
                    marginRight: '16px',
                    marginBottom: '16px',
                }}
            >
                <div style={{
                    paddingBottom: `${height / width * 100}%`,
                }} />
                <div
                    ref={element => { this.container = element; }}
                    className='uk-transition-toggle'
                    style={{
                        position: 'absolute',
                        top: '0',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        ref={element => { this.image = element; }}
                        className={`tm-thumbnail-shadow ${info.frames ? `tm-thumbnail-animate-${info.frames}` : ''}`}
                        style={{
                            background: `url(${info.src})`,
                            backgroundSize: 'cover',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                    <div className='uk-transition-slide-bottom uk-overlay uk-light uk-position-bottom uk-padding-small uk-text-small'>
                        {info.label}
                    </div>
                </div>
            </div>
        );
    }
}

Thumbnail.fragment = gql`
    fragment Thumbnail on MediaFile {
        id
        path
        name
        url
        mimeType
        fileSize
        width
        height
        duration
        orientation
        recorded
        created
        palette(first: 1) {
            edges {
                node {
                    id
                    color
                    prominence
                }
            }
        }
        thumbnails(profile: $profile, first: 1) {
            edges {
                node {
                    id
                    width
                    height
                    url
                }
            }
        }
        filmstrips(profile: $profile, first: 1) {
            edges {
                node {
                    id
                    width
                    height
                    url
                    frames
                }
            }
        }
    }
`;
