// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import List from 'ui/List';
import ListItem from 'ui/ListItem';
import AlphaList from './AlphaList';

import type { AlphaListItem } from './AlphaList';
import type { Item } from './types';

/**
 * Type declaration for Props.
 */
type Props<T: Item> = {
    loading: boolean,
    fetchNext?: () => void;
    items?: Array<T>,

    selectedItemId: ?string,

    renderChildren: (T) => AlphaListItem,
};

/**
 * The component.
 */
export default class ConnectionListView<T: Item> extends React.Component<void, Props<T>, void> {
    /**
     * @inheritdoc
     */
    props: Props<T>;

    /**
     * Handle the last item shown.
     *
     * This will load additional items, if available.
     *
     * @param {boolean} visible Whether the last item is visible, or not.
     * @returns {void}
     */
    @autobind handleLastItem(visible: boolean): void {
        if (this.props.fetchNext) {
            this.props.fetchNext();
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        if (this.props.loading) {
            return (
                <List><ListItem>Loading...</ListItem></List>
            );
        }

        if (!this.props.items) {
            return (
                <List><ListItem>Something went wrong.</ListItem></List>
            );
        }

        return (
            <AlphaList
                items={this.props.items.map(this.props.renderItem)}
                selectedKey={this.props.selectedItemId}
                onLastItem={this.handleLastItem} />
        );
    }
}
