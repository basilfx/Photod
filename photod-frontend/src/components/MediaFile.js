// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

import Lightbox from './Lightbox';

import duration from 'format-duration';
import filesize from 'filesize';

import gql from 'graphql-tag';

type MediaFileType = any;

/**
 * Type declaration for Props.
 */
type Props = {
    height: number,
    mediaFile: MediaFileType,
    onClick?: (MediaFileType) => void,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    height: number,
    margin: number,
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

type State = {
    frame: number,
    lightbox: boolean,
};

/**
 * Media file thumbnail component.
 */
export default class MediaFile extends React.Component<DefaultProps, Props, State> {
    parseMediaFile: () => MediaFileParser;

    state: State;

    props: Props;

    container: HTMLDivElement;

    image: HTMLDivElement;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        margin: 4,
        height: 240,
    }

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

        for (const parser of MediaFile.parsers) {
            const target = parser.mimeType.split(';', 1)[0].split('/');

            if (target[0] === source[0] || target[0] === '*') {
                if (target[1] === source[1] || target[1] === '*') {
                    // $FlowFixMe
                    this.parseMediaFile = this[parser.parser];
                    break;
                }
            }
        }

        // Setup state.
        this.state = {
            frame: 0,
            lightbox: false,
        };
    }

    componentDidMount() {
        this.container.addEventListener('dblclick', this.handleDoubleClick);
        window.addEventListener('resize', this.handleResize);

        this.handleResize();
    }

    componentWillUnmount() {
        this.container.removeEventListener('dblclick', this.handleDoubleClick);
        window.removeEventListener('resize', this.handleResize);
    }

    @autobind handleDoubleClick() {
        this.setState({
            lightbox: true,
        });
    }

    @autobind handleClose() {
        this.setState({
            lightbox: false,
        });
    }

    @autobind handleResize() {
        const info = this.parseMediaFile();

        if (info.orientation === 90 || info.orientation === 270) {
            const rect = this.container.getClientRects();

            this.image.style.transform = `rotate(${info.orientation}deg)`;
            this.image.style.transformOrigin = `${rect[0].width / 2}px`;
            this.image.style.width = `${rect[0].height}px`;
            this.image.style.height = `${rect[0].width}px`;

            if (this.image.parentNode) {
                this.image.parentNode.style.width = `${rect[0].width}px`;
                this.image.parentNode.style.height = `${rect[0].height}px`;
            }
        }
    }

    /**
     * Render the media file as an image component.
     *
     * @return {MediaFileParser} An image component.
     */
    parseImage(): MediaFileParser {
        const mediaFile = this.props.mediaFile;
        const thumbnails = mediaFile.thumbnails.edges;

        return {
            src: thumbnails.length ? thumbnails[0].node.url : this.props.mediaFile.url,
            backgroundColor: mediaFile.palette.edges.length ? mediaFile.palette.edges[0].node.color : '#fff',
            width: mediaFile.width || 0,
            height: mediaFile.height || 0,
            frames: 1,
            orientation: mediaFile.orientation || 0,
            label: (
                <span>
                    <Icon icon='image' /> {mediaFile.width}x{mediaFile.height}, {filesize(mediaFile.fileSize)}, {mediaFile.faces.edges.length} faces
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
        const filmstrips = mediaFile.filmstrips.edges;

        return {
            src: filmstrips.length ? filmstrips[0].node.url : require('images/filmstrip.svg'),
            backgroundColor: '#ffffff',
            width: filmstrips[0].node.width / filmstrips[0].node.frames,
            height: filmstrips[0].node.height,
            frames: filmstrips[0].node.frames,
            orientation: 0,
            label: (
                <span>
                    <Icon icon='video-camera' /> {duration(mediaFile.duration / 1000)}, {filesize(mediaFile.fileSize)}
                </span>
            )
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
            <div ref={element => { this.container = element; }} className='uk-card uk-card-default uk-card-hover' style={{
                flexGrow: `${width / height * 100}`,
                flexBasis: `${width * this.props.height / height}px`,
                maxHeight: `${this.props.height}px`,
                maxWidth: `${this.props.height * (width / height)}px`,
                margin: `8px`,
                backgroundColor: info.backgroundColor,
            }}>
                <div style={{
                    paddingBottom: `${height / width * 100}%`,
                }} />
                <div className='uk-transition-toggle tm-mediafile' style={{
                    position: 'absolute',
                    top: '0',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}>
                    <div ref={element => { this.image = element; }} className={ info.frames ? `tm-mediafile-animate-${info.frames}` : ''} style={{
                        background: `url(${info.src})`,
                        backgroundSize: 'cover',
                        width: '100%',
                        height: '100%',
                    }} />
                    <div className='uk-transition-slide-bottom uk-overlay uk-light uk-position-bottom uk-padding-small uk-text-small'>
                        {info.label}
                    </div>
                </div>
                {this.state.lightbox && <Lightbox mediaFile={this.props.mediaFile} onClose={this.handleClose} />}
            </div>
        );
    }
}

MediaFile.fragment = gql`
    fragment MediaFileFragment on MediaFile {
        id
        url
        mimeType
        fileSize
        width
        height
        duration
        orientation
        recorded
        created
        faces {
            edges {
                node {
                    id
                    x1
                    y1
                    x2
                    y2
                    person {
                          id
                          name
                    }
                }
            }
        }
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
