import {yellow} from '@mui/material/colors';
import {LogCommands} from '../../../types';
import {DIRECTION_TYPE_UPLINK, DIRECTION_TYPE_DOWNLINK} from '../../../constants';


export const getSubLogColor = (logCommand: LogCommands): string => {
    switch (logCommand.command.directionType) {
        case undefined:
            return 'grey.100';

        case DIRECTION_TYPE_UPLINK:
            return yellow[50];

        case DIRECTION_TYPE_DOWNLINK:
            return 'success.light';
    }
};
