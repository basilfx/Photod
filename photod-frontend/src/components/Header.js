// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import { Link } from 'react-router-dom';

import Breadcrumb from 'ui/Breadcrumb';
import BreadcrumbItem from 'ui/BreadcrumbItem';
import Navbar from 'ui/Navbar';
import NavbarContainer from 'ui/NavbarContainer';
import NavbarItem from 'ui/NavbarItem';
import Icon from 'ui/Icon';

import Search from './Search';

/**
 * Type declaration for HeaderTrail.
 */
type HeaderTrail = Array<{
    label: string,
    to?: string,
}>;

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
 * The header component.
 *
 * In the header componenent, the breadcrumb and search component are shown.
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
     * Render the trail of breadcrumb items.
     *
     * @returns {?Array<React.Element<*>>} Breadcrumb items.
     */
    renderTrail() {
        if (!this.props.trail) {
            return;
        }

        return this.props.trail.map((item, index) =>
            <BreadcrumbItem key={index}>
                <Link to={item.to || '#'}>{item.label}</Link>
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

                {this.props.search && <Navbar position='right' className='nav-overlay'>
                    <a className='uk-navbar-toggle' data-uk-toggle='target: .nav-overlay; animation: uk-animation-fade' href='#'>
                        <Icon icon='search' size={1} />
                    </a>
                </Navbar>}

                {this.props.search && <Search />}
            </NavbarContainer>
        );
    }
}
