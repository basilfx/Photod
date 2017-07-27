// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import { Link } from 'react-router-dom';

import Main from 'components/Main';

import Header from 'components/Header';
import SidebarLeft from 'components/SidebarLeft';
import Menu from 'components/Menu';
import AlphaList from 'components/AlphaList';

import TagsMediaList from './TagsMediaList';

import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

import { createConnectionProps, fromRelay } from 'utils/graphql';

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
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

/**
 * The component.
 */
class Tags extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    @autobind onLastItem() {
        if (this.props.fetchNext){
            this.props.fetchNext();
        }
    }

    * renderItems() {
        for (const tag of this.props.tags || []) {
            yield {
                key: tag.label,
                label: tag.label,
                component: <Link to={`/tags/${tag.label}`}>{tag.label}</Link>,
            };
        }
    }

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
                        panel={<AlphaList items={Array.from(this.renderItems())} selectedKey={this.props.tag} onLastItem={this.onLastItem} />}
                    />
                }
            >
                {this.props.tag && <TagsMediaList tag={this.props.tag} />}
            </Main>
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
})(Tags);
