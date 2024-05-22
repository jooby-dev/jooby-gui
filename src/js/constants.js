import * as joobyCodec from 'jooby-codec';


const prepareCommandMap = ( commandMap, direction ) => {
    Object.keys(commandMap).forEach(commandName => {
        commandMap[commandName].directionType = direction;
        commandMap[commandName].hasParameters = Object
            .values(commandMap[commandName].examples)
            .some(example => Object.keys(example.parameters).length > 0);
    });

    return commandMap;
};

const prepareCommandList = CommandMap => [
    ...Object.values(CommandMap.uplink),
    ...Object.values(CommandMap.downlink)
]
    .map(item => ({
        value: item,
        label: item.name,
        direction: directionNames[item.directionType]
    }));

export const directions = {
    DOWNLINK: 1,
    UPLINK: 2
};

export const directionNames = {
    [directions.DOWNLINK]: 'downlink',
    [directions.UPLINK]: 'uplink'
};

export const commands = {
    analog: {
        uplink: prepareCommandMap(joobyCodec.analog.commands.uplink, directions.UPLINK),
        downlink: prepareCommandMap(joobyCodec.analog.commands.downlink, directions.DOWNLINK)
    },
    obisObserver: {
        uplink: prepareCommandMap(joobyCodec.obisObserver.commands.uplink, directions.UPLINK),
        downlink: prepareCommandMap(joobyCodec.obisObserver.commands.downlink, directions.DOWNLINK)
    },
    mtx: {
        uplink: prepareCommandMap(joobyCodec.mtx.commands.uplink, directions.UPLINK),
        downlink: prepareCommandMap(joobyCodec.mtx.commands.downlink, directions.DOWNLINK)
    }
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

export const ACCESS_KEY_LENGTH_BYTES = 16;

export const DEFAULT_ACCESS_KEY = joobyCodec.utils.getHexFromBytes([...Array(16).keys()], {separator: ' '});

export const UNKNOWN_COMMAND_NAME = 'Unknown';

export const commandTypeConfigMap = {
    [COMMAND_TYPE_ANALOG]: {
        hasLrc: true,
        hasHardwareType: true,
        preparedCommandList: prepareCommandList(commands.analog),
        hardwareTypeList: Object.entries(joobyCodec.analog.constants.hardwareTypes).map(
            ([key, value]) => ({
                label: key,
                value
            })
        )
    },

    [COMMAND_TYPE_OBIS_OBSERVER]: {
        hasLrc: false,
        hasHardwareType: false,
        preparedCommandList: prepareCommandList(commands.obisObserver),
        hardwareTypeList: null
    },

    [COMMAND_TYPE_MTX]: {
        hasLrc: true,
        hasHardwareType: false,
        preparedCommandList: prepareCommandList(commands.mtx),
        hardwareTypeList: null
    }
};
