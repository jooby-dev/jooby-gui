import {ArrowDownward as ArrowDownwardIcon} from '@mui/icons-material';
import {yellow} from '@mui/material/colors';
import {directions} from '../constants.js';


const createDirectionIcon = direction => {
    if ( direction === directions.UPLINK ) {
        return <ArrowDownwardIcon sx={{mr: 2, transform: 'rotate(180deg)', color: `${yellow[800]}`}}/>;
    }

    return <ArrowDownwardIcon color="success" sx={{mr: 2}}/>;
};


export default createDirectionIcon;
