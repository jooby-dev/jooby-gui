import {analog, obisObserver, mtx, utils} from '@jooby-dev/jooby-codec';
import {directions} from '@jooby-dev/jooby-codec/constants/index.js';


const {DOWNLINK, UPLINK} = directions;

export const directionNames = {
    [DOWNLINK]: 'downlink',
    [UPLINK]: 'uplink'
};

const prepareCommandList = commands => [...Object.values(commands.uplink), ...Object.values(commands.downlink)]
    .filter(item => item.id)
    .map(item => ({
        label: item.name,
        value: item,
        direction: directionNames[item.directionType]
    }));

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

export const ACCESS_KEY_LENGTH_BYTES = 16;

export const DEFAULT_ACCESS_KEY = utils.getHexFromBytes(new Uint8Array([...Array(16).keys()]), {separator: ' '});

export const commandTypeConfigMap = {
    [COMMAND_TYPE_ANALOG]: {
        hasLrc: true,
        hasHardwareType: true,
        preparedCommandList: prepareCommandList(analog.commands),
        hardwareTypeList: Object.entries(analog.constants.hardwareTypes).map(
            ([key, value]) => ({
                label: key,
                value
            })
        )
    },

    [COMMAND_TYPE_OBIS_OBSERVER]: {
        hasLrc: false,
        hasHardwareType: false,
        preparedCommandList: prepareCommandList(obisObserver.commands),
        hardwareTypeList: null
    },

    [COMMAND_TYPE_MTX]: {
        hasLrc: false,
        hasHardwareType: false,
        preparedCommandList: prepareCommandList(mtx.commands),
        hardwareTypeList: null
    }
};
