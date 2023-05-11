import {constants} from 'jooby-codec';


const {AUTO, DOWNLINK, UPLINK} = constants.directions;


export const LOG_TYPE_ERROR = 0;

export const LOG_TYPE_MESSAGE = 1;

export const SEVERITY_TYPE_SUCCESS = 'success';

export const SEVERITY_TYPE_WARNING = 'warning';

export const SEVERITY_TYPE_ERROR = 'error';

export const PARAMETERS_TAB_VIEW_TYPE_TREE = 'tree';

export const PARAMETERS_TAB_VIEW_TYPE_JSON = 'json';

export const LOG_COUNT_LIMIT = 30;

export const directions = {
    [DOWNLINK]: 'downlink',
    [UPLINK]: 'uplink'
} as const;

export const parseButtonNameMap = {
    [AUTO]: 'Parse (auto)',
    [DOWNLINK]: `Parse (${directions[DOWNLINK]})`,
    [UPLINK]: `Parse (${directions[UPLINK]})`
} as const;

export const hardwareTypeList = Object.entries(constants.hardwareTypes).map(([key, value]) => ({
    label: key,
    value
} as const));
