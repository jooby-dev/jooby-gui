import * as joobyCodec from 'jooby-codec';


export const directions = {
    DOWNLINK: 1,
    UPLINK: 2
};

export const directionNames = {
    [directions.DOWNLINK]: 'downlink',
    [directions.UPLINK]: 'uplink'
};

export const LOG_TYPE_ERROR = 'error';

export const LOG_TYPE_MESSAGE = 'message';

export const LOG_TYPE_FRAME = 'frame';

export const SEVERITY_TYPE_SUCCESS = 'success';

export const SEVERITY_TYPE_WARNING = 'warning';

export const SEVERITY_TYPE_ERROR = 'error';

export const PARAMETERS_TAB_VIEW_TYPE_TREE = 'tree';

export const PARAMETERS_TAB_VIEW_TYPE_JSON = 'json';

export const LOG_COUNT_LIMIT = 30;

export const COMMAND_TYPE_ANALOG = 'analog';

export const COMMAND_TYPE_OBIS_OBSERVER = 'obisObserver';

export const COMMAND_TYPE_MTX = 'mtx';

// mtxLora is not a codec, but it is added because the UI should function as if it is one
export const COMMAND_TYPE_MTX_LORA = 'mtxLora';

export const ACCESS_KEY_LENGTH_BYTES = 16;

export const DEFAULT_ACCESS_KEY = joobyCodec.utils.getHexFromBytes([...Array(16).keys()], {separator: ' '});

export const UNKNOWN_COMMAND_NAME = 'Unknown';
