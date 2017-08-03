// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

import Thumbnail from './Thumbnail';

import { fromRelay } from 'utils/graphql';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import profile from 'profile';

import type { MediaFile as BaseMediaFile, Face, Text } from './types';

/**
 * Type declaration for MediaFile.
 */
type MediaFile = BaseMediaFile & {
    recorded: string,
    orientation: number,
    width: number,
    height: number,
    fileSize: number,
    duration: number,
    faces: ?Array<Face>,
    texts: ?Array<Text>,
    url: string,
};

/**
 * Type declaration for Props.
 */
type Props = {
    mediaFile: MediaFile,
    onClose: () => void,
    onPrevious: ?() => void,
    onNext: ?() => void,
};

/**
 * Lightbox component.
 */
class Lightbox extends React.Component<void, Props, void> {
    /**
     * Component properties.
     *
     * @type {Props}
     */
    props: Props;

    faces: HTMLDivElement;

    image: HTMLImageElement;

    static fragment: mixed;

    /**
     * @inheritdoc
     */
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('resize', this.handleResize);

        this.image.addEventListener('load', this.handleResize);

        if (document.body) {
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * @inheritdoc
     */
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.handleResize);

        this.image.removeEventListener('load', this.handleResize);

        if (document.body) {
            document.body.style.overflow = 'auto';
        }
    }

    @autobind handleResize() {
        if (!this.image || !this.faces) {
            return;
        }

        const rect = this.image.getClientRects();

        this.faces.style.top = `${rect[0].top}px`;
        this.faces.style.left = `${rect[0].left}px`;
        this.faces.style.bottom = `${rect[0].bottom}px`;
        this.faces.style.right = `${rect[0].right}px`;
        this.faces.style.width = `${rect[0].width}px`;
        this.faces.style.height = `${rect[0].height}px`;
        this.faces.style.position = `absolute`;
    }

    @autobind handleKeyDown(event: Event) {
        if (event.which === 37) {
            this.props.onPrevious && this.props.onPrevious();
        }
        else if (event.which === 39) {
            this.props.onNext && this.props.onNext();
        }
        else if (event.which === 27) {
            this.props.onClose();
        }
    }

    renderFaces() {
        const faces = [];

        if (!this.props.mediaFile.faces) {
            return;
        }

        for (const face of this.props.mediaFile.faces) {
            faces.push(
                <div key={face.id} style={{
                    position: 'absolute',
                    top: `${face.y1 * 100}%`,
                    left: `${face.x1 * 100}%`,
                    width: `${(face.x2 - face.x1) * 100}%`,
                    height: `${(face.y2 - face.y1) * 100}%`,
                    border: '3px solid rgba(255, 0, 0, 0.25)',
                    zIndex: 3000,
                }} />
            );
        }

        return faces;
    }

    renderTexts() {
        const texts = [];

        if (!this.props.mediaFile.texts) {
            return;
        }

        for (const text of this.props.mediaFile.texts) {
            texts.push(
                <div key={text.id} style={{
                    position: 'absolute',
                    top: `${text.y1 * 100}%`,
                    left: `${text.x1 * 100}%`,
                    width: `${(text.x2 - text.x1) * 100}%`,
                    height: `${(text.y2 - text.y1) * 100}%`,
                    border: '3px solid rgba(0, 0, 255, 0.25)',
                    zIndex: 3000,
                }} />
            );
        }

        return texts;
    }

    /**
     * @inheritdoc
     */
    render() {
        const mediaFile = this.props.mediaFile;

        const thumbnails = mediaFile.thumbnails;

        return (
            <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: '#000000',
                zIndex: 2000,
            }} >
                {this.props.onPrevious && <div className='uk-flex uk-flex-left uk-flex-middle' onClick={this.props.onPrevious} style={{
                    top: '0',
                    bottom: '0',
                    left: '0',
                    width: '100px',
                    position: 'absolute',
                    zIndex: 3,
                }}>
                    <Icon icon='chevron-left' size={3} />
                </div>}
                <img ref={ element => { this.image = element; }}
                    src={thumbnails.length ? thumbnails[0].url : ''} style={{
                        boxShadow: '1px 0 0 0 rgba(255, 255, 255, 0.1) inset, 0 0 1px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.5)',
                        backgroundColor: mediaFile.palette.length ? mediaFile.palette[0].color : '#fff',
                        display: 'block',
                        maxWidth: '90%',
                        maxHeight: '90%',
                        position: 'relative',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 3,
                    }}
                />
                <div style={{
                    backgroundColor: mediaFile.palette.length ? mediaFile.palette[0].color : '#fff',
                    backgroundImage: `url(${thumbnails.length ? thumbnails[0].url : ''})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: '50%',
                    filter: 'saturate(50%) blur(50px)',
                    position: 'absolute',
                    top: '-150px',
                    left: '-150px',
                    right: '-150px',
                    bottom: '-150px',
                    zIndex: 1,
                }} />
                {this.props.onNext && <div className='uk-flex uk-flex-right uk-flex-middle' onClick={this.props.onNext} style={{
                    top: '0',
                    bottom: '0',
                    right: '0',
                    width: '100px',
                    position: 'absolute',
                    zIndex: 3,
                }}>
                    <Icon icon='chevron-right' size={3} />
                </div>}
                <div ref={element => { this.faces = element; }}>
                    {this.renderFaces()}
                    {this.renderTexts()}
                </div>
            </div>
        );
    }
}

const Query = gql`
    query MediaFile($id: ID!, $profile: String) {
        mediaFile(id: $id) {
            ...Thumbnail,
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
            texts {
                edges {
                    node {
                        id
                        x1
                        y1
                        x2
                        y2
                        content
                        confidence
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
        }
    }
    ${Thumbnail.fragment}
`;

export default graphql(Query, {
    options: (props: Props) => ({
        variables: {
            id: props.mediaFile.id,
            profile: JSON.stringify({
                width: profile.lightbox.width,
                quality: profile.quality,
                mimeType: profile.mimeTypes,
            }),
        },
    }),
    props: ({ data, ownProps }) => ({
        loading: data.loading,
        mediaFile: (data.mediaFile && fromRelay(data.mediaFile)) || ownProps.mediaFile,
    }),
})(Lightbox);
