// @flow

import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import MediaFile from './MediaFile';

import moment from 'moment-timezone';

/**
 * Type declaration for Props.
 */
type Props = {
    mediaFiles: Object,
    groupBy?: string,
    onLastItem?: (boolean) => void;
};

/**
 * Type declaration for DefaultProps.
 */
type DefaultProps = {
    // TODO
};

type State = {
    selected: {
        [string]: boolean
    },
};

/**
 * The component.
 */
export default class MediaList extends React.Component<DefaultProps, Props, State> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    state: State;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    /**
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            selected: {},
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    @autobind handleKeyDown(event) {
        if (event.ctrlKey) {
            this.ctrlKey = true;
        }
    }

    @autobind handleKeyUp(event) {
        this.ctrlKey = false;
    }

    @autobind handleSelect(mediaFile) {
        if (!this.ctrlKey) {
            this.handleDeselectAll();
        }

        this.setState({
            selected: Object.assign({}, this.state.selected, {
                [mediaFile.id]: true,
            }),
        });
    }

    @autobind handleDeselect(mediaFile) {
        this.setState({
            selected: Object.assign({}, this.state.selected, {
                [mediaFile.id]: false,
            }),
        });
    }

    @autobind handleDeselectAll() {
        this.setState({
            selected: {},
        });
    }

    @autobind handleLightbox() {

    }

    getGroup(mediaFile: MediaFile): string {
        return moment.tz(
            mediaFile.recorded,
            window.getApplicationTimezone()
        ).format('YYYY-MM-DD');
    }

    * renderMediaFiles(): any {
        let lastGroup;

        if (this.props.mediaFiles) {
            for (const edge of this.props.mediaFiles.edges) {
                const group = this.getGroup(edge.node);

                if (group !== lastGroup) {
                    yield <div key={`group-${group}`} className='uk-text-lead uk-width-1-1'>{group}</div>;

                    lastGroup = group;
                }

                yield (
                    <MediaFile
                        selected={this.state.selected[edge.node.id]}
                        key={edge.node.id}
                        mediaFile={edge.node}
                        onClick={this.handleSelect}
                    />
                );
            }
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div>
                <div className='uk-padding-small uk-height-1-1 uk-flex uk-flex-wrap'>
                    {Array.from(this.renderMediaFiles())}
                </div>
                {this.props.onLastItem && <div style={{ height: '50vh', marginTop: '-50vh' }}>
                    <VisibilitySensor partialVisibility onChange={this.props.onLastItem} />
                </div>}
            </div>
        );
    }
}
