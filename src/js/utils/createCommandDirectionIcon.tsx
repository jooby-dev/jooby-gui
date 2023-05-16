import {ArrowDownward as ArrowDownwardIcon, QuestionMark as QuestionMarkIcon} from '@mui/icons-material';
import {yellow} from '@mui/material/colors';
import {analog} from '@jooby-dev/jooby-codec';


const {directions} = analog.constants;


const createCommandDirectionIcon = (directionType: typeof directions.DOWNLINK | typeof directions.UPLINK | undefined) => {
    switch (directionType) {
        case undefined:
            return <QuestionMarkIcon sx={{mr: 2, color: 'grey.700'}}/>;

        case directions.UPLINK:
            return <ArrowDownwardIcon sx={{mr: 2, transform: 'rotate(180deg)', color: `${yellow[800]}`}}/>;

        case directions.DOWNLINK:
            return <ArrowDownwardIcon color="success" sx={{mr: 2}}/>;
    }
};


export default createCommandDirectionIcon;
