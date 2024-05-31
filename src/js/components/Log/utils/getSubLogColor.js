import {yellow} from '@mui/material/colors';
import {directions} from '../../../constants.js';


export default ( direction, error ) => {
    if ( error ) {
        return 'error.light';
    }

    switch ( direction ) {
        case directions.UPLINK:
            return yellow[50];

        case directions.DOWNLINK:
            return 'success.light';

        default:
            return 'grey.100';
    }
};
