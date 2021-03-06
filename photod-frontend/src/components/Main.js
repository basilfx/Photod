// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import 'styles/main.less';

/**
 * Type declaration for Props.
 */
type Props = {
    children?: React.Element<*>,
    header: React.Element<*>,
    sidebarLeft?: React.Element<*>,
    sidebarRight?: React.Element<*>,
    footer?: React.Element<*>,
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
export default class Main extends React.Component<DefaultProps, Props, void> {
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

                    <article className="uk-height-1-1 tm-content">
                        {this.props.children}
                    </article>

                    {this.props.sidebarRight}
                </main>

                {this.props.footer}
            </div>
        );
    }
}
