import {commands as analogCommands} from 'jooby-codec/analog';
import {directions} from 'jooby-codec/constants/index.js';

import {COMMAND_TYPE_ANALOG} from '../constants.js';


const convertDataParameterToUint8Array = parameters => ({
    ...parameters,
    data: new Uint8Array(parameters.data)
});

const converters = {
    [COMMAND_TYPE_ANALOG]: {
        [directions.DOWNLINK]: {
            [analogCommands.downlink.DataSegment.id]: convertDataParameterToUint8Array,
            [analogCommands.downlink.WriteImage.id]: convertDataParameterToUint8Array
        },

        [directions.UPLINK]: {
            [analogCommands.uplink.DataSegment.id]: convertDataParameterToUint8Array
        }
    }
};


export default ( {id, type, direction, parameters} ) => {
    const converter = converters[type]?.[direction]?.[id];

    return converter ? converter(parameters) : parameters;
};
