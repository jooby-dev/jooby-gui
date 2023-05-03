import {ArrowDownward as ArrowDownwardIcon, QuestionMark as QuestionMarkIcon} from '@mui/icons-material';
import {yellow} from '@mui/material/colors';
import {DIRECTION_TYPE_DOWNLINK, DIRECTION_TYPE_UPLINK} from '../constants';


export const createCommandDirectionIcon = (directionType: typeof DIRECTION_TYPE_DOWNLINK | typeof DIRECTION_TYPE_UPLINK | undefined) => {
    switch (directionType) {
        case undefined:
            return <QuestionMarkIcon sx={{mr: 2, color: 'grey.700'}} />;

        case DIRECTION_TYPE_UPLINK:
            return <ArrowDownwardIcon sx={{mr: 2, transform: 'rotate(180deg)', color: `${yellow[800]}`}} />;

        case DIRECTION_TYPE_DOWNLINK:
            return <ArrowDownwardIcon color="success" sx={{mr: 2}} />;
    }
};
