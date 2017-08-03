// @flow

import React from 'react';

import { Link } from 'react-router-dom';

import ConnectionListView from 'components/ConnectionListView';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import { createConnectionProps, fromRelay } from 'utils/graphql';

import type { Tag } from 'components/types';

/**
 * Type declaration for Props.
 */
type Props = {
    tag?: string,

    loading: boolean,
    fetchNext?: () => void;
    tags?: Array<Tag>
};

/**
 * The component.
 */
class TagsListView extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    render() {
        class TagsConnectionListView extends ConnectionListView<Tag> {}

        return (
            <TagsConnectionListView
                items={this.props.tags}
                selectedItemId={this.props.tag}
                renderItem={item => ({
                    key: item.label,
                    label: item.label,
                    component: <Link to={`/tags/${item.label}`}>{item.label}</Link>,
                })}
                {...this.props}
            />
        );
    }
}

const Query = gql`
    query Tags($after: String) {
        tags(first: 100, after: $after) {
            edges {
                node {
                    id
                    label
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
    props: ({ data }) => createConnectionProps(data, 'tags', fromRelay),
})(TagsListView);
