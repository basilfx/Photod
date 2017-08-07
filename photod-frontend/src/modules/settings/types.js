// @flow

import type { FluxStandardAction } from 'flux-standard-action';

export type ActionType = 'photod/application/locations/SET_VIEWPORT';

export type Payload = {
    key: string,
    value: mixed,
};

export type State = {
    [string]: mixed,
};

export type Action = FluxStandardAction<ActionType, Payload, *>;
