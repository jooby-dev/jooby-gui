import {TCommandType} from '../../../types.js';
import {COMMAND_TYPE_ANALOG, COMMAND_TYPE_OBIS_OBSERVER} from '../../../constants.js';


const headerLengthUrlParts: {[key: number]: string} = {
    1: 'command-with-a-one-byte-header',
    2: 'command-with-a-two-bytes-header',
    3: 'command-with-a-three-bytes-header'
};

const commandTypeUrlParts: {[key in TCommandType]: string} = {
    [COMMAND_TYPE_ANALOG]: 'analog',
    [COMMAND_TYPE_OBIS_OBSERVER]: 'obis-observer'
};


export default (headerLength: number, commandType: TCommandType): string => {
    const headerLengthUrlPart = headerLengthUrlParts[headerLength];

    if (!headerLengthUrlPart) {
        throw new Error(`Invalid header length: ${headerLength}`);
    }

    return `https://github.com/jooby-dev/jooby-docs/blob/main/docs/${commandTypeUrlParts[commandType]}/message.md#${headerLengthUrlPart}`;
};
