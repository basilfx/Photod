// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

/**
 * Type declaration for Props.
 */
type Props = {
    menu: React.Element<*>,
    panel?: React.Element<*>,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

/**
 * Type declaration for State.
 */
type State = {
    expanded: boolean,
};

/**
 * The component.
 */
export default class SidebarLeft extends React.Component<DefaultProps, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    state: State;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    /**
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            expanded: true,
        };
    }

    @autobind handleToggle() {
        this.setState({
            expanded: !this.state.expanded,
        });
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <aside className='tm-sidebar-left'>
                <div className='tm-sidebar-left-menu' data-panel={!!this.props.panel}>
                    {this.props.menu}
                </div>
                {this.props.panel && <div className={`tm-sidebar-left-panel tm-sidebar-left-panel-${this.state.expanded ? 'expanded' : 'collapsed'} uk-overflow-auto`}>
                    <div onClick={this.handleToggle} className='tm-sidebar-toggle'>
                        <Icon icon={`chevron-${this.state.expanded ? 'left' : 'right'}`} size={1.5} />
                    </div>
                    {this.state.expanded && this.props.panel}
                </div>}
            </aside>
        );
    }
}
