// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';

import PeopleListView from './PeopleListView';
import PeopleMediaList from './PeopleMediaList';

import { fromRelay } from 'utils/graphql';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import type { Person } from 'components/types';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    person: ?Person,

    id?: string,
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
class People extends React.Component<DefaultProps, Props, void> {
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
        const trail = [
            {
                label: 'People',
            },
        ];

        if (this.props.person) {
            trail.push({
                label: this.props.person.name,
            });
        }

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='people' />}
                        panel={<PeopleListView personId={this.props.id} />}
                    />
                }
            >
                {this.props.id && <PeopleMediaList personId={this.props.id} />}
            </Main>
        );
    }
}

const Query = gql`
    query Person($id: ID!) {
        person(id: $id) {
            name
        }
    }
`;

export default graphql(Query, {
    skip: (ownProps: Props) => !ownProps.id,
    options: (props: Props) => ({
        variables: {
            id: props.id,
        },
    }),
    props: ({ data, ownProps }) => ({
        loading: data.loading,
        person: fromRelay(data.person),
    }),
})(People);
