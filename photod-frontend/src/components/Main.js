// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

// loads the Icon plugin
UIkit.use(Icons);

import 'font-awesome/scss/font-awesome.scss';
import 'styles/main.less';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: any,
    header: any,
    sidebarLeft?: any,
    sidebarRight?: any,
    footer?: any,
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
export default class Template extends React.Component<DefaultProps, Props, void> {
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
            <div className="uk-height-viewport tm-page">
                {this.props.header}

                <main className="tm-body">
                    {this.props.sidebarLeft}

                    <article className="uk-height-1-1 uk-overflow-auto tm-content">
                        {this.props.children}
                    </article>

                    {this.props.sidebarRight}
                </main>

                {this.props.footer}
            </div>
        );
    }
}
