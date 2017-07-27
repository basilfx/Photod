// @flow

import bowser from 'bowser';

import autobind from 'autobind-decorator';

import React from 'react';

import VisibilitySensor from 'react-visibility-sensor';

import Thumbnail from './Thumbnail';

import moment from 'moment-timezone';

/**
 * Type declaration for MediaFileType.
 */
type MediaFileType = {
    id: String,
};

/**
 * Type declaration for Props.
 */
type Props = {
    mediaFiles: Object,
    groupBy?: string,
    onLastItem?: (boolean) => void;
    onSelection?: (Array<any>) => void,
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
     * Boolean to indicate whether multiple select is enabled.
     *
     * @type {boolean}
     */
    multipleSelect: boolean

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    /**
     * @inheritdoc
     */
    constructor(props: Props) {
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

    @autobind handleKeyDown(event: KeyboardEvent) {
        if ((!bowser.mac && event.ctrlKey) || (bowser.mac && event.metaKey)) {
            this.multipleSelect = true;
        }
    }

    @autobind handleKeyUp(event: KeyboardEvent) {
        this.multipleSelect = false;
    }

    @autobind handleSelect(mediaFile: MediaFileType): void {
        if (!this.multipleSelect) {
            this.handleDeselectAll();
        }

        const selected = Object.assign({}, this.state.selected, {
            [mediaFile.id]: true,
        });

        this.setState({
            selected,
        });

        if (this.props.onSelection) {
            this.props.onSelection(this.props.mediaFiles.edges.filter(edge =>
                !!selected[edge.node.id]
            ).map(
                edge => edge.node
            ));
        }
    }

    @autobind handleDeselect(mediaFile) {
        const selected = Object.assign({}, this.state.selected, {
            [mediaFile.id]: false,
        });

        this.setState({
            selected,
        });

        if (this.props.onSelection) {
            this.props.onSelection(this.props.mediaFiles.edges.filter(edge =>
                !!selected[edge.node.id]
            ).map(
                edge => edge.node
            ));
        }
    }

    @autobind handleDeselectAll() {
        this.setState({
            selected: {},
        });

        if (this.props.onSelection) {
            this.props.onSelection(null);
        }
    }

    @autobind handleLightbox() {

    }

    getGroup(mediaFile: MediaFile): string {
        return moment.tz(
            mediaFile.recorded,
            window.getApplicationTimezone()
        ).format('YYYY-MM-DD');
    }

    * renderMediaFiles(): Generator<React.Element<*>, *, *> {
        let lastGroup;

        if (this.props.mediaFiles) {
            for (const edge of this.props.mediaFiles.edges) {
                const group = this.getGroup(edge.node);

                if (group !== lastGroup) {
                    yield <div key={`group-${group}`} className='uk-text-lead uk-width-1-1'>{group}</div>;

                    lastGroup = group;
                }

                yield (
                    <Thumbnail
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
