import {commandTypes} from '../../src/js/constants/index.js';
import {commandTypeConfigMap} from '../../src/js/joobyCodec.js';


export default Object.freeze({
    codecType: {
        label: 'Codec',
        options: commandTypes
    },

    hardwareType: {
        label: 'Hardware type',
        description: {
            text: 'May be required for parsing and creating a message'
        },
        analog: {
            options: commandTypeConfigMap.analog.hardwareTypeList,
            commands: commandTypeConfigMap.analog.preparedCommandList.map(command => command.value.name.toString())
        }
    },

    parseMessages: {
        title: {
            text: 'Parse messages'
        },
        description: {
            text: 'Batch processing supported, each dump on a new line'
        },
        format: {
            hex: 'hex',
            base64: 'base64'
        },
        directions: {
            uplink: 'uplink'
        },
        dump: {
            label: 'Dump'
        },
        parseButton: 'parse-button'
    },

    createMessages: {
        title: {
            text: 'Create message'
        },
        description: {
            text: 'Commands in the message must be of the same direction'
        },
        select: {
            label: 'Command'
        },
        addCommandButton: 'add-command-button'
    },

    logs: {
        title: {
            text: 'Logs'
        },
        buttons: {
            expandLogs: 'Expand logs',
            deleteLogs: 'Delete logs'
        }
    }
});
