// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import List from 'ui/List';
import ListItem from 'ui/ListItem';

import type { Node } from './types';

/**
 * Type declaration for Props.
 */
export type Props<T: Node> = {
    loading: boolean,
    fetchNext?: () => void,
    nodes: ?Array<T>,

    selectedNodeId: ?string,

    renderNode: (T, () => void, (T) => string) => React.Element<*>,
    renderChildren: (T) => React.Element<*>,

    expanded: {
        [string]: {
            [string]: boolean,
        }
    };
    toggle: (string) => void;
};

/**
 * The component.
 */
export default class ConnectionTreeview<T: Node> extends React.Component<void, Props<T>, void> {
    /**
     * @inheritdoc
     */
    props: Props<T>;

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
     * Handle toggeling an item.
     *
     * @param {string} childId The child node identifier.
     * @returns {void}
     */
    @autobind handleToggle(childId: string): void {
        this.props.toggle(childId);
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

        if (!this.props.nodes) {
            return (
                <List><ListItem>Something went wrong.</ListItem></List>
            );
        }

        if (!this.props.nodes.length) {
            return (
                <List><ListItem>No nodes.</ListItem></List>
            );
        }

        const icon = (node) => {
            if (node.childrenCount === 0) {
                if (node.id === this.props.selectedNodeId) {
                    return 'chevron-down';
                }
                else {
                    return 'chevron-right';
                }
            }
            else if (this.props.expanded[node.id]) {
                return 'minus';
            }
            else {
                return 'plus';
            }
        };

        const nodeCount = this.props.nodes.length;

        return (
            <List className='tm-treeview'>
                {this.props.nodes.map(node =>
                    <ListItem key={node.id}>
                        {this.props.renderNode(
                            node, () => this.handleToggle(node.id), icon)
                        }
                        {node.childrenCount > 0 &&
                            this.props.expanded[node.id] &&
                            this.props.renderChildren(node)}
                    </ListItem>
                )}
                {this.props.fetchNext && <ListItem>
                    <VisibilitySensor key={`sensor-${nodeCount}`} partialVisibility onChange={this.handleLastItem} />
                </ListItem>}
            </List>
        );
    }
}
