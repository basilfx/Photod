// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import List from 'ui/List';
import ListItem from 'ui/ListItem';

type AlphaListItem = {
    key?: string,
    label: string,
    component: any,
};

/**
 * Type declaration for Props.
 */
type Props = {
    items: Array<AlphaListItem>,
    onLastItem?: () => void,
    showCount?: boolean,
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
    };

    @autobind handleChange(visible: boolean) {
        if (visible && this.props.onLastItem) {
            this.props.onLastItem();
        }
    }

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

    * renderListItems(): any {
        let lastGroup = '';

        for (const item of this.props.items) {
            const group = this.getGroup(item);

            if (lastGroup !== group) {
                yield <ListItem key={`group-${group}`} className='uk-padding-small uk-text-lead'>{group}</ListItem>;

                lastGroup = group;
            }

            yield <ListItem key={`item-${item.key ? item.key : item.label}`} className='uk-padding-small tm-list-item'>{item.component}</ListItem>;
        }

        if (this.props.showCount) {
            yield <ListItem key='counter' className='uk-padding-small uk-text-lead uk-text-center'>{this.props.items.length} items</ListItem>;
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div>
                <List>
                    {Array.from(this.renderListItems())}
                </List>
                {this.props.onLastItem && <div style={{ height: '50vh', marginTop: '-50vh' }}>
                    <VisibilitySensor partialVisibility onChange={this.handleChange} />
                </div>}
            </div>
        );
    }
}
