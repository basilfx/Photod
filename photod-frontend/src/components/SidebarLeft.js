// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import { connect } from 'react-redux';

import Icon from 'ui/Icon';

import { toggle } from 'modules/application/panels/actions';

/**
 * Type declaration for Props.
 */
type Props = {
    menu: React.Element<*>,
    panel?: React.Element<*>,
    expanded: boolean,
    toggle: () => void,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

/**
 * The component.
 */
class SidebarLeft extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    /**
     * Handle panel toggeling.
     * 
     * @returns {void}
     */
    @autobind handleToggle(): void {
        this.props.toggle();
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
                {this.props.panel && <div className={`tm-sidebar-left-panel tm-sidebar-left-panel-${this.props.expanded ? 'expanded' : 'collapsed'} uk-overflow-auto`}>
                    <div onClick={this.handleToggle} className='tm-sidebar-toggle'>
                        <Icon icon={`chevron-${this.props.expanded ? 'left' : 'right'}`} size={1.5} />
                    </div>
                    {this.props.expanded && this.props.panel}
                </div>}
            </aside>
        );
    }
}

export default connect(
    (state, props: Props) => ({
        expanded: state.application.panels.left,
    }),
    (dispatch, props: Props) => ({
        toggle() {
            return dispatch(toggle('left'));
        },
    })
)(SidebarLeft);
