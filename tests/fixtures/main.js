import {commandTypes} from '../../src/js/constants/index.js';
import {commandTypeConfigMap} from '../../src/js/joobyCodec.js';


export default Object.freeze({
    codecType: {
        id: '#select-command-type',
        options: Object.values(commandTypes)
    },
    hardwareType: {
        id: '#select-hardware-type',
        description: {
            selector: 'p',
            text: 'May be required for parsing and creating a message'
        },
        analog: {
            options: commandTypeConfigMap.analog.hardwareTypeList,
            commands: commandTypeConfigMap.analog.preparedCommandList.map(command => command.value.name.toString())
        }
    },
    parseMessages: {
        title: {
            selector: 'h5',
            text: 'Parse messages'
        },
        description: {
            selector: 'p',
            text: 'Batch processing supported, each dump on a new line'
        },
        parseButton: '#parseButton'
    },
    createMessages: {
        title: {
            selector: 'h5',
            text: 'Create message'
        },
        description: {
            selector: 'p',
            text: 'Commands in the message must be of the same direction'
        },
        select: {
            id: '#select-command'
        },
        addCommandButton: '#addCommand'
    },
    logs: {
        title: {
            selector: 'h5',
            text: 'Logs'
        }
    }
});
