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
    panel: React.Element<*>,
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
class SidebarRight extends React.Component<DefaultProps, Props, void> {
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
            <aside className='tm-sidebar-right'>
                <div className={`tm-sidebar-right-panel tm-sidebar-right-panel-${this.props.expanded ? 'expanded' : 'collapsed'} uk-overflow-auto`}>
                    <div onClick={this.handleToggle} className='tm-sidebar-toggle'>
                        <Icon icon={`chevron-${this.props.expanded ? 'right' : 'left'}`} size={1.5} />
                    </div>
                    {this.props.expanded && this.props.panel}
                </div>
            </aside>
        );
    }
}

export default connect(
    (state, props: Props) => ({
        expanded: state.application.panels.right,
    }),
    (dispatch, props: Props) => ({
        toggle() {
            return dispatch(toggle('right'));
        },
    })
)(SidebarRight);
