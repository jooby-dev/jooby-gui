import * as joobyCodec from 'jooby-codec';
import {
    directions,
    directionNames,
    commandTypes
} from './constants/index.js';


globalThis.joobyCodec = joobyCodec;


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

const prepareCommandList = commandMap => [
    ...Object.values(commandMap.uplink),
    ...Object.values(commandMap.downlink)
]
    .map(item => ({
        value: item,
        label: item.isLoraOnly ? `${item.name} (LoRa only)` : item.name,
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
    mtx1: {
        uplink: prepareCommandMap(joobyCodec.mtx1.commands.uplink, directions.UPLINK),
        downlink: prepareCommandMap(joobyCodec.mtx1.commands.downlink, directions.DOWNLINK)
    },
    mtx3: {
        uplink: prepareCommandMap(joobyCodec.mtx3.commands.uplink, directions.UPLINK),
        downlink: prepareCommandMap(joobyCodec.mtx3.commands.downlink, directions.DOWNLINK)
    }
};

export const commandTypeConfigMap = {
    [commandTypes.ANALOG]: {
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

    [commandTypes.OBIS_OBSERVER]: {
        hasLrc: false,
        hasHardwareType: false,
        preparedCommandList: prepareCommandList(commands.obisObserver),
        hardwareTypeList: null
    },

    [commandTypes.MTX1]: {
        hasLrc: true,
        hasHardwareType: false,
        preparedCommandList: prepareCommandList(commands.mtx1),
        hardwareTypeList: null
    },

    [commandTypes.MTX3]: {
        hasLrc: true,
        hasHardwareType: false,
        preparedCommandList: prepareCommandList(commands.mtx3),
        hardwareTypeList: null
    }
};
