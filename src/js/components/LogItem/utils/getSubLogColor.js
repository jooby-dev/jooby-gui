import {yellow} from '@mui/material/colors';
import {directions} from '@jooby-dev/jooby-codec/constants/index.js';


export default logCommand => {
    switch (logCommand.command.directionType) {
        case directions.UPLINK:
            return yellow[50];

        case directions.DOWNLINK:
            return 'success.light';

        default:
            return 'grey.100';
    }
};
