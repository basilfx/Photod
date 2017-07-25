// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

/**
 * Type declaration for Props.
 */
type Props = {
    // children?: any,
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
export default class MediaInfo extends React.Component<DefaultProps, Props, void> {
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
        return (
            <div>
                <h4>DSC_1234.jpg</h4>

                <dl className='uk-description-list'>
                    <dt>Path</dt>
                    <dd>/long/path/to/the/file/DSC_234.jpg</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>MIME-type</dt>
                    <dd>image/jpeg</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>File size</dt>
                    <dd>300mb</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>Dimensions</dt>
                    <dd>3000x1000</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>Duration</dt>
                    <dd>1:03</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>Tags</dt>
                    <dd>vidoe panorama</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>Faces</dt>
                    <dd>2 faces</dd>
                </dl>

                <dl className='uk-description-list'>
                    <dt>Locations</dt>
                    <dd>3 locations</dd>
                </dl>
            </div>
        );
    }
}
