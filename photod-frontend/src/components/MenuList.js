// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import List from 'ui/List';
import ListItem from 'ui/ListItem';

type MenuListItem = {
    key?: string,
    label: string,
    component: any,
};

/**
 * Type declaration for Props.
 */
type Props = {
    items: Array<MenuListItem>,
    selectedKey?: string,
    onLastItem?: () => void,
    showCount: boolean,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    showCount: boolean,
};

/**
 * The component.
 */
export default class MenuList extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        showCount: false,
    };

    @autobind handleChange(visible: boolean) {
        if (visible && this.props.onLastItem) {
            this.props.onLastItem();
        }
    }

    * renderListItems(): any {
        for (const item of this.props.items) {
            yield <ListItem
                key={`item-${item.key ? item.key : item.label}`}
                active={item.key === this.props.selectedKey}
                className='tm-list-item'
            >
                {item.component}
            </ListItem>;
        }

        if (this.props.showCount) {
            yield <ListItem key='counter' className='tm-list-counter'>{this.props.items.length} items</ListItem>;
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
                    <VisibilitySensor partialVisibility onChange={this.handleChange} />
                </div>}
            </div>
        );
    }
}
