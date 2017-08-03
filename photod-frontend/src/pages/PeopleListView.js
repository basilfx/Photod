// @flow

import React from 'react';

import { Link } from 'react-router-dom';

import ConnectionListView from 'components/ConnectionListView';

import { fromGlobalId } from 'graphql-relay';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import { createConnectionProps, fromRelay } from 'utils/graphql';

import type { Person } from 'components/types';

/**
 * Type declaration for Props.
 */
type Props = {
    personId?: string,

    loading: boolean,
    fetchNext?: () => void;
    people?: Array<Person>
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
class PeopleListView extends React.Component<DefaultProps, Props, void> {
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
        class PeopleConnectionListView extends ConnectionListView<Person> {}

        return (
            <PeopleConnectionListView
                items={this.props.persons}
                selectedItemId={this.props.personId}
                renderItem={item => ({
                    key: item.id,
                    label: item.name,
                    component: (
                        <span>
                            <Link to={`/people/${fromGlobalId(item.id).id}`}>
                                {item.name}
                            </Link>

                            &nbsp;

                            ({item.facesCount})
                        </span>
                    ),
                })}
                {...this.props}
            />
        );
    }
}

const Query = gql`
    query People($after: String) {
        persons(first: 100, after: $after) {
            edges {
                node {
                    id
                    name
                    facesCount
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export default graphql(Query, {
    props: ({ data }) => createConnectionProps(data, 'persons', fromRelay),
})(PeopleListView);
