// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import List from 'ui/List';
import ListItem from 'ui/ListItem';

/**
 * Type declaration for a AlphaListItem.
 */
type AlphaListItem = {
    key?: string,
    label: string,
    component: React.Element<*>,
};

/**
 * Type declaration for GroupByFunc.
 */
type GroupByFunc = (AlphaListItem) => string;

/**
 * Type declaration for Props.
 */
type Props = {
    items: Array<AlphaListItem>,
    selectedKey?: string,
    onLastItem?: () => void,
    showCount?: boolean,
    groupBy: GroupByFunc | boolean,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    showCount: boolean,
    groupBy: boolean,
};

/**
 * List component for alpha-numeric items.
 *
 * The list expects a list of items (ordered if group by is enabled). Each
 * item has a label, which is used for grouping items. You can provide a method
 * to group items, or use the first character by default.
 *
 * There is support for lazy loading items. An event is raised when the last
 * item is shown on screen. Additionally, a counter can be shown to show the
 * number of items drawn.
 */
export default class AlphaList extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        showCount: true,
        groupBy: true,
    };

    /**
     * Handle visibility sensor change event.
     *
     * @returns {void}
     */
    @autobind handleChange(visible: boolean): void {
        if (visible && this.props.onLastItem) {
            this.props.onLastItem();
        }
    }

    /**
     * Return a group name for a given item.
     *
     * This method returns three groups:
     *
     * - 0-9 for labels starting with a digit.
     * - [A-Z] for labels starting with a letter.
     * - # otherwise.
     *
     * @param {AlphaListItem} item Item to determine group name of.
     * @returns {string} Group name.
     */
    getGroup(item: AlphaListItem): string {
        const letter = item.label[0];

        if (letter.match(/[0-9]/i)) {
            return '0-9';
        }
        else if (letter.match(/[a-z]/i)) {
            return letter[0].toLowerCase();
        }
        else {
            return '#';
        }
    }

    /**
     * Generate the groups and list items.
     *
     * @generator
     * @yields {React.Element<*>} List items.
     */
    * renderListItems(): Generator<React.Element<*>, void, void> {
        let lastGroup = '';

        for (const item of this.props.items) {
            if (this.props.groupBy) {
                // Find the group name.
                let group;

                if (this.props.groupBy === true) {
                    group = this.getGroup(item);
                }
                else {
                    group = this.props.groupBy(item);
                }

                // Render group name.
                if (lastGroup !== group) {
                    yield (
                        <ListItem key={`group-${group}`} className='tm-list-group'>
                            {group}
                        </ListItem>
                    );

                    lastGroup = group;
                }
            }

            // Render the list item.
            yield (
                <ListItem
                    key={`item-${item.key ? item.key : item.label}`}
                    active={item.key === this.props.selectedKey}
                    className='tm-list-item'
                >
                    {item.component}
                </ListItem>
            );
        }

        // Render the items counter.
        if (this.props.showCount) {
            yield (
                <ListItem key='counter' className='tm-list-counter'>
                    {this.props.items.length} items
                </ListItem>
            );
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div>
                <List className='tm-list'>
                    {Array.from(this.renderListItems())}
                </List>
                {this.props.onLastItem && <div style={{ height: '50vh', marginTop: '-50vh' }}>
                    <VisibilitySensor
                        key={`sensor-${this.props.items.length}`}
                        onChange={this.handleChange}
                        partialVisibility />
                </div>}
            </div>
        );
    }
}
