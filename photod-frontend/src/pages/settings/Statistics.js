// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import profile from 'profile';

/**
 * Type declaration for Props.
 */
type Props = {
    loading: boolean,
    jobs?: Object
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
export default class Statistics extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    renderJobs() {
        if (this.props.loading) {
            return null;
        }

        if (!this.props.jobs.edges) {
            return <p>No active jobs.</p>
        }

        const jobs = [];

        for (const job of this.props.jobs.edges) {
            jobs.push(
                <dl key={job.id} className='uk-description-list'>
                    <dt>{job.node.title}</dt>
                    <dd>
                        <progress className='uk-progress' value={job.node.progress} max='100' style={{ maxWidth: '33%' }} />
                    </dd>
                </dl>
            );
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div className='uk-padding-small'>
                <h3>Current profile</h3>

                <dl className='uk-description-list'>
                    <dt>Minimal quality</dt>
                    <dd>{profile.quality}</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>Preferred MIME-types</dt>
                    <dd>{profile.mimeTypes.join(', ')}</dd>
                </dl>

                <h3>Active jobs</h3>

                {this.renderJobs()}
            </div>
        );
    }
}
