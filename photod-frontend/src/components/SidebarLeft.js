// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

/**
 * Type declaration for Props.
 */
type Props = {
    menu: any,
    panel?: any,
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
export default class SidebarLeft extends React.Component<DefaultProps, Props, void> {
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
     * @inheritdoc
     */
    render() {
        return (
            <aside className='tm-sidebar-left'>
                <div className='tm-sidebar-left-menu' data-panel={!!this.props.panel}>
                    {this.props.menu}
                </div>
                {this.props.panel && <div className='tm-sidebar-left-panel uk-overflow-auto'>
                    {this.props.panel}
                </div>}
            </aside>
        );
    }
}
