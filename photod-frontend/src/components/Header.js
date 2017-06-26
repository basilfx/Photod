// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Breadcrumb from 'ui/Breadcrumb';
import BreadcrumbItem from 'ui/BreadcrumbItem';
import Navbar from 'ui/Navbar';
import NavbarContainer from 'ui/NavbarContainer';
import NavbarItem from 'ui/NavbarItem';
import Icon from 'ui/Icon';

type HeaderTrail = Array<{ label: string }>;

/**
 * Type declaration for Props.
 */
type Props = {
    trail?: HeaderTrail,
    search: boolean,
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    trail: HeaderTrail,
    search: boolean,
};

/**
 * The component.
 */
export default class Header extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {
        trail: [],
        search: true,
    };

    /**
     * [className description]
     * @type {String}
     */
    renderTrail() {
        return (this.props.trail || []).map((item, index) =>
            <BreadcrumbItem key={index}>
                <a href='#'>{item.label}</a>
            </BreadcrumbItem>
        );
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <NavbarContainer className='uk-navbar-transparent tm-header'>
                <Navbar position='left' className='nav-overlay'>
                    <NavbarItem componentClass='a' className='uk-logo'>
                        <Icon icon='camera' size={1.5} />
                    </NavbarItem>

                    <NavbarItem>
                        <Breadcrumb className='uk-margin-remove uk-text-uppercase tm-breadcrumb'>
                            {this.renderTrail()}
                        </Breadcrumb>
                    </NavbarItem>
                </Navbar>

                {this.props.search && <div className="nav-overlay uk-navbar-right">
                    <a className="uk-navbar-toggle" data-uk-toggle="target: .nav-overlay; animation: uk-animation-fade" href="#">
                        <Icon icon='search' size={1} />
                    </a>
                </div>}

                {this.props.search && <div className="nav-overlay uk-navbar-left uk-flex-1" hidden>
                    <div className="uk-navbar-item uk-width-expand">
                        <form className="uk-search uk-search-navbar uk-width-1-1">
                            <input className="uk-search-input" type="search" placeholder="Search..." autoFocus />
                        </form>
                    </div>

                    <a className="uk-navbar-toggle" data-uk-toggle="target: .nav-overlay; animation: uk-animation-fade" href="#">
                        <Icon icon='close' size={1} />
                    </a>
                </div>}
            </NavbarContainer>
        );
    }
}
