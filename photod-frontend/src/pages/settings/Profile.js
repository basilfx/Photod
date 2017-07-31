// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import Button from 'ui/Button';

import DateTime from 'components/DateTime';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    me?: {
        firstName: string,
        lastName: string,
        username: string,
    },
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
class Profile extends React.Component<DefaultProps, Props, void> {
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
     * Handle the logout button.
     *
     * @return {void}
     */
    @autobind handleLogout() {
        window.location.href = '/logout';
    }

    /**
     * @inheritdoc
     */
    render() {
        if (this.props.loading) {
            return null;
        }

        const formatName = () => {
            if (!this.props.me) {
                return '(nameless)';
            }

            if (!this.props.me.firstName) {
                return this.props.me.username;
            }

            return (
                <span title={this.props.me.username}>
                    this.props.me.firstName;
                </span>
            );
        };

        return (
            <div className='uk-padding-small'>
                <p>
                    You are signed in as {formatName()}.
                </p>

                <dl className='uk-description-list'>
                    <dt>Date joined</dt>
                    <dd><DateTime timestamp={this.props.me && this.props.me.dateJoined} /></dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>Last login</dt>
                    <dd><DateTime timestamp={this.props.me && this.props.me.lastLogin} /></dd>
                </dl>

                <Button buttonStyle='danger' onClick={this.handleLogout}>
                    Logout
                </Button>
            </div>
        );
    }
}

const ProfileQuery = gql`
    query Profile {
        me {
            id
            username
            firstName
            lastName
            lastLogin
            dateJoined
        }
    }
`;

export default graphql(ProfileQuery, {
    props({ data: { loading, me } }) {
        return {
            loading,
            me,
        };
    },
})(Profile);
