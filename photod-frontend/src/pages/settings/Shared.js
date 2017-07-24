// @flow

// import autobind from 'autobind-decorator';

import React from 'react';

import Icon from 'ui/Icon';

import DateTime from 'components/DateTime';

import profile from 'profile';

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
export default class Shared extends React.Component<DefaultProps, Props, void> {
    /**
     * @inheritdoc
     */
    props: Props;

    /**
     * @inheritdoc
     */
    static defaultProps = {

    };

    renderRows() {
        const row = {
            since: '',
            expires: '',
        };

        return (
            <tr>
                <td></td>
                <td></td>
                <td><DateTime timestamp={row.since}/></td>
                <td><DateTime timestamp={row.expires}/></td>
                <td>
                    <Icon icon='link' />
                    <Icon icon='trash' />
                </td>
            </tr>
        );
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <div className='uk-padding-small'>
                <table className='uk-table uk-table-divider'>
                    <thead>
                        <tr>
                            <th>Media File</th>
                            <th>Views</th>
                            <th>Shared Since</th>
                            <th>Expires</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tfoot>
                        {this.renderRows()}
                    </tfoot>
                </table>
            </div>
        );
    }
}
