import {analog, obisObserver} from '@jooby-dev/jooby-codec';


const {DOWNLINK, UPLINK} = analog.constants.directions;

export const directionNames = {
    [DOWNLINK]: 'downlink',
    [UPLINK]: 'uplink'
} as const;

const prepareCommandList = (commands) => [...Object.values(commands.uplink), ...Object.values(commands.downlink)]
    .filter(item => item.id)
    .map(item => ({
        label: item.name,
        value: item,
        direction: directionNames[item.directionType]
    }));


export const LOG_TYPE_ERROR = 0;

export const LOG_TYPE_MESSAGE = 1;

export const SEVERITY_TYPE_SUCCESS = 'success';

export const SEVERITY_TYPE_WARNING = 'warning';

export const SEVERITY_TYPE_ERROR = 'error';

export const PARAMETERS_TAB_VIEW_TYPE_TREE = 'tree';

export const PARAMETERS_TAB_VIEW_TYPE_JSON = 'json';

export const LOG_COUNT_LIMIT = 30;

export const COMMAND_TYPE_ANALOG = 'analog';

export const COMMAND_TYPE_OBIS_OBSERVER = 'obisObserver';

export const commandTypeConfigMap = {
    [COMMAND_TYPE_ANALOG]: {
        hasLrc: true,
        hasHardwareType: true,
        preparedCommandList: prepareCommandList(analog.commands),
        hardwareTypeList: Object.entries(analog.constants.hardwareTypes).map(([key, value]) => ({
            label: key,
            value
        } as const))
    },
    [COMMAND_TYPE_OBIS_OBSERVER]: {
        hasLrc: false,
        hasHardwareType: false,
        preparedCommandList: prepareCommandList(obisObserver.commands),
        hardwareTypeList: null
    }
} as const;
