import {commands as analogCommands} from 'jooby-codec/analog';
import {directions} from 'jooby-codec/constants/index.js';

import {COMMAND_TYPE_ANALOG} from '../constants.js';


const convertDataParameterToArray = parameters => ({
    ...parameters,
    data: Array.from(parameters.data)
});

const convertDataParameterToUint8Array = parameters => ({
    ...parameters,
    data: new Uint8Array(parameters.data)
});

const convertCommandParameters = ( conversionDirection, {id, type, direction, parameters} ) => {
    const converter = converters[conversionDirection][type]?.[direction]?.[id];

    return converter ? converter(parameters) : parameters;
};

const conversionDirections = {
    FROM_CODEC: 1,
    TO_CODEC: 2
};

const converters = {
    [conversionDirections.FROM_CODEC]: {
        [COMMAND_TYPE_ANALOG]: {
            [directions.DOWNLINK]: {
                [analogCommands.downlink.DataSegment.id]: convertDataParameterToArray,
                [analogCommands.downlink.WriteImage.id]: convertDataParameterToArray
            },

            [directions.UPLINK]: {
                [analogCommands.uplink.DataSegment.id]: convertDataParameterToArray
            }
        }
    },

    [conversionDirections.TO_CODEC]: {
        [COMMAND_TYPE_ANALOG]: {
            [directions.DOWNLINK]: {
                [analogCommands.downlink.DataSegment.id]: convertDataParameterToUint8Array,
                [analogCommands.downlink.WriteImage.id]: convertDataParameterToUint8Array
            },

            [directions.UPLINK]: {
                [analogCommands.uplink.DataSegment.id]: convertDataParameterToUint8Array
            }
        }
    }
};


export const convertCommandParametersFromCodecFormat = convertCommandParameters.bind(null, conversionDirections.FROM_CODEC);

export const convertCommandParametersToCodecFormat = convertCommandParameters.bind(null, conversionDirections.TO_CODEC);
