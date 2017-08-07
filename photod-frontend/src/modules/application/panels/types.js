// @flow

import type { FluxStandardAction } from 'flux-standard-action';

export type ActionType = 'photod/application/panels/TOGGLE';

export type Payload = {
    panel: string,
};

export type State = {
    left: boolean,
    right: boolean,
};

export type Action = FluxStandardAction<ActionType, Payload, *>;
