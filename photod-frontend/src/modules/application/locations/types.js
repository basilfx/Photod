// @flow

import type { FluxStandardAction } from 'flux-standard-action';

export type ActionType = 'photod/application/locations/SET_VIEWPORT';

export type Payload = {
    center: ?[number, number],
    zoom: ?number,
};

export type State = {
    viewport: {
        center: ?[number, number],
        zoom: ?number,
    },
};

export type Action = FluxStandardAction<ActionType, Payload, *>;
