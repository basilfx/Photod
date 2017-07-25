// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

/**
 * Type declaration for Props.
 */
type Props = {
    panel: any,
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
export default class SidebarRight extends React.Component<DefaultProps, Props, void> {
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
            <aside className="tm-sidebar-right">
                <div className='tm-sidebar-right-panel uk-overflow-auto'>
                    {this.props.panel}
                </div>
            </aside>
        );
    }
}
