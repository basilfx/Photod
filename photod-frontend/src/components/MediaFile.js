// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

import Lightbox from './Lightbox';

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

    image: HTMLDivElement;

    timer: number;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        margin: 4,
        height: 192,
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
        this.image.addEventListener('mouseover', this.handleMouseOver);
        this.image.addEventListener('mouseout', this.handleMouseOut);
        this.image.addEventListener('dblclick', this.handleDoubleClick);
    }

    componentWillUnmount() {
        this.image.removeEventListener('mouseover', this.handleMouseOver);
        this.image.removeEventListener('mouseout', this.handleMouseOut);
        this.image.removeEventListener('dblclick', this.handleDoubleClick);
    }

    @autobind handleMouseOver() {
        this.timer = setInterval(() => this.setState({
            frame: this.state.frame + 1,
        }), 500);
    }

    @autobind handleMouseOut() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
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

    /**
     * Render the media file as an image component.
     *
     * @return {MediaFileParser} An image component.
     */
    parseImage(): MediaFileParser {
        const mediaFile = this.props.mediaFile;

        const thumbnails = mediaFile.thumbnails.edges
            .filter(
                edge => edge.node.height >= this.props.height
            )
            .sort(
                (a, b) => a.node.height - b.node.height
            );

        return {
            src: thumbnails.length ? thumbnails[0].node.url : this.props.mediaFile.url,
            backgroundColor: mediaFile.palette.edges.length ? mediaFile.palette.edges[0].node.color : '#fff',
            width: mediaFile.width || 0,
            height: mediaFile.height || 0,
            frames: 1,
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

        const filmstrips = mediaFile.filmstrips.edges
            .filter(
                edge => edge.node.height >= this.props.height
            )
            .sort(
                (a, b) => a.node.height - b.node.height
            );

        return {
            src: filmstrips.length ? filmstrips[0].node.url : require('images/filmstrip.svg'),
            backgroundColor: '#ffffff',
            width: filmstrips[0].node.width / filmstrips[0].node.frames,
            height: filmstrips[0].node.height,
            frames: filmstrips[0].node.frames,
            label: <span />,
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
            label: <span />,
        };
    }

    /**
     * @inheritdoc
     */
    render() {
        const info = this.parseMediaFile();

        return (
            <div ref={element => { this.image = element; }} className='uk-card uk-card-default uk-card-hover' style={{
                flexGrow: `${info.width / info.height * 100}`,
                flexBasis: `${info.width * this.props.height / info.height}px`,
                maxHeight: `${this.props.height * 2}px`,
                maxWidth: `${this.props.height * 2 * (info.width / info.height)}px`,
                margin: `8px`,
                backgroundColor: info.backgroundColor,
            }}>
                <span style={{
                    display: 'block',
                    paddingBottom: `${info.height / info.width * 100}%`,
                }} />
                <div className='uk-transition-toggle tm-mediafile' style={{
                    position: 'absolute',
                    verticalAlign: 'bottom',
                    top: '0',
                    width: '100%',
                    height: '100%',
                    borderRadius: '2px',
                    background: `url(${info.src})`,
                    backgroundSize: 'cover',
                    backgroundPositionX: `${100 * (this.state.frame % info.frames)}%`,
                }}>
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
        id,
        url,
        mimeType,
        fileSize,
        width,
        height,
        faces {
            edges {
                node {
                    id,
                    x1,
                    y1,
                    x2,
                    y2,
                    person {
                          id,
                          name,
                    }
                }
            }
        }
        palette(first: 1) {
            edges {
                node {
                    color,
                    prominence,
                }
            }
        }
        thumbnails(minHeight: $minHeight) {
            edges {
                node {
                    width
                    height
                    url
                }
            }
        }
        filmstrips(minHeight: $minHeight) {
            edges {
                node {
                    width
                    height
                    url
                    frames
                }
            }
        }
    }
`;
