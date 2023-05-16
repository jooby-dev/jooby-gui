import {yellow} from '@mui/material/colors';
import {analog} from '@jooby-dev/jooby-codec';
import {TLogCommands} from '../../../types.js';


const {directions} = analog.constants;


export default (logCommand: TLogCommands): string => {
    switch (logCommand.command.directionType) {
        case undefined:
            return 'grey.100';

        case directions.UPLINK:
            return yellow[50];

        case directions.DOWNLINK:
            return 'success.light';
    }
};
