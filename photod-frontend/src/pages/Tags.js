// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import { Link } from 'react-router-dom';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';
import AlphaList from 'components/AlphaList';

import TagsListView from './TagsListView';
import TagsMediaList from './TagsMediaList';

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
    tags?: Array<any>
};

/**
 * The component.
 */
class Tags extends React.Component<void, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    render() {
        const trail = [
            {
                label: 'Tags',
            },
        ];

        if (this.props.tag) {
            trail.push({
                label: this.props.tag,
            });
        }

        return (
            <Main
                header={<Header trail={trail} />}
                sidebarLeft={
                    <SidebarLeft
                        menu={<Menu selectedKey='tags' />}
                        panel={<TagsListView tag={this.props.tag} />}
                    />
                }
            >
                {this.props.tag && <TagsMediaList tag={this.props.tag} />}
            </Main>
        );
    }
}

const Query = gql`
    query Tag($tag: String!) {
        tag(label: $id) {
            name
        }
    }
`;

export default graphql(Query, {
    skip: (ownProps: Props) => !ownProps.id,
    options: (props: Props) => ({
        variables: {
            tag: props.tag,
        },
    }),
    props: ({ data, ownProps }) => ({
        loading: data.loading,
        person: fromRelay(data.person),
    }),
})(Tags);
