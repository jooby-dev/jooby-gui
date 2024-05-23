import * as joobyCodec from 'jooby-codec';
import {
    directions,
    directionNames,
    COMMAND_TYPE_ANALOG,
    COMMAND_TYPE_OBIS_OBSERVER,
    COMMAND_TYPE_MTX
} from './constants.js';


const prepareCommandMap = ( commandMap, direction ) => {
    const result = {};

    Object.keys(commandMap).forEach(commandName => {
        const command = {...commandMap[commandName]};

        command.directionType = direction;
        command.hasParameters = Object
            .values(command.examples)
            .some(example => Object.keys(example.parameters).length > 0);

        result[commandName] = command;
    });

    return result;
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
