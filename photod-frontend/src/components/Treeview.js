// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import List from 'ui/List';
import ListItem from 'ui/ListItem';

type Tree = {
    label: string,
    loading?: boolean,
    expanded?: boolean,
    nodes?: Array<Tree>,
};

/**
 * Type declaration for Props.
 */
type Props = {
    items: Array<Object>,
    onLastItem?: (any) => void,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

type State = {
    tree: Tree
}

/**
 * The component.
 */
export default class Treeview extends React.Component<DefaultProps, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    renderNodes(node?: any) {
        if (!node) {
            return (
                <List className='uk-padding-small'>
                    {this.props.items.map(item => this.renderNodes(item))}
                </List>
            );
        }

        const result = [
            <ListItem key={`node-${node.id}`}>
                {node.expanded ? '-' : '+'} &nbsp; {node.label}

                <List>
                    {node.children.map(node => this.renderNodes(node))}
                </List>
            </ListItem>,
        ];

        if (this.props.onLastItem) {
            result.push(
                <ListItem key={`sensor-${node.id}`}>
                    <VisibilitySensor onChange={() => this.props.onLastItem && this.props.onLastItem(node)} />
                </ListItem>
            );
        }

        return result;
    }

    /**
     * @inheritdoc
     */
    render() {
        return this.renderNodes();
    }
}
