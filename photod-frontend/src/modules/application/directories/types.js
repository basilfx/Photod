// @flow

import type { FluxStandardAction } from 'flux-standard-action';

export type ActionType = 'photod/application/directories/TOGGLE';

export type Payload = {
    parentId: string,
    childId: string,
};

export type State = {
    [string]: {
        [string]: boolean
    },
};

export type Action = FluxStandardAction<ActionType, Payload, *>;
