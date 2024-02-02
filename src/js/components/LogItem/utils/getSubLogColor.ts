import {yellow} from '@mui/material/colors';
import {TLogCommands} from '../../../types.js';
import {directions} from '@jooby-dev/jooby-codec/constants/index.js';


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
