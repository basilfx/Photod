// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import gql from 'graphql-tag';

import type { MediaFile as BaseMediaFile, Face } from './types';

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
    faces: Array<Face>,
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
export default class Lightbox extends React.Component<void, Props, void> {
    /**
     * Component properties.
     *
     * @type {Props}
     */
    props: Props;

    static fragment: mixed;

    /**
     * @inheritdoc
     */
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);

        if (document.body) {
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * @inheritdoc
     */
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);

        if (document.body) {
            document.body.style.overflow = 'auto';
        }
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

        for (const face of this.props.mediaFile.faces) {
            faces.push(
                <div key={face.id} style={{
                    position: 'absolute',
                    top: `${face.y1 * 100}%`,
                    left: `${face.x1 * 100}%`,
                    width: `${(face.x2 - face.x1) * 100}%`,
                    height: `${(face.y2 - face.y1) * 100}%`,
                    border: '3px solid rgba(255, 0, 0, 0.5)',
                    zIndex: 3000,
                }} />
            );
        }

        return faces;
    }

    /**
     * @inheritdoc
     */
    render() {
        const mediaFile = this.props.mediaFile;

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
                {this.props.onPrevious && <div className='hover' onClick={this.props.onPrevious} style={{
                    top: '0',
                    bottom: '0',
                    left: '0',
                    width: '100px',
                    position: 'absolute',
                    // backgroundImage: `url(${require('images/left.svg')})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '50%',
                    zIndex: 3,
                }} />}
                <img src={`${mediaFile.url}`} style={{
                    boxShadow: '1px 0 0 0 rgba(255, 255, 255, 0.1) inset, 0 0 1px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.5)',
                    backgroundColor: mediaFile.palette.length ? mediaFile.palette[0].node.color : '#fff',
                    display: 'block',
                    maxWidth: '90%',
                    maxHeight: '90%',
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                }} />
                <div style={{
                    backgroundColor: mediaFile.palette.edges.length ? mediaFile.palette.edges[0].node.color : '#fff',
                    backgroundImage: `url(${mediaFile.url})`,
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
                {this.props.onNext && <div className='hover' onClick={this.props.onNext} style={{
                    top: '0',
                    bottom: '0',
                    right: '0',
                    width: '100px',
                    position: 'absolute',
                    // backgroundImage: `url(${require('images/right.svg')})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '50%',
                    zIndex: 3,
                }} />}
                <div>
                    {this.renderFaces()}
                </div>
            </div>
        );
    }
}

Lightbox.fragment = gql`
    fragment Lightbox on MediaFile {
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
    }
`;
