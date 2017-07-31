// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Loading from 'components/Loading';
import MediaList from 'components/MediaList';

import type { MediaFile } from './Thumbnail';

type SelectionHandler = Array<MediaFile> => void;

/**
 * Type declaration for Props.
 */
export type Props = {
    loading: boolean,
    fetchNext: () => void,
    mediaFiles?: Array<MediaFile>,

    onSelection: ?SelectionHandler,
};

/**
 * The component.
 */
export default class DirectoryMediaList extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * Handle the last item shown.
     *
     * This will load additional thumbnails, if available.
     *
     * @param {boolean} visible Whether the last item is visible, or not.
     * @returns {void}
     */
    @autobind handleLastItem(visible: boolean): void {
        if (visible && this.props.fetchNext) {
            this.props.fetchNext();
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        if (this.props.loading) {
            return <Loading />;
        }

        if (!this.props.mediaFiles) {
            return (
                <span>Something went wrong.</span>
            );
        }

        return <MediaList onSelection={this.props.onSelection} mediaFiles={this.props.mediaFiles} onLastItem={this.handleLastItem} />;
    }
}
