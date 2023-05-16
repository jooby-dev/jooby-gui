import {ArrowDownward as ArrowDownwardIcon, QuestionMark as QuestionMarkIcon} from '@mui/icons-material';
import {yellow} from '@mui/material/colors';
import * as joobyCodec from '@jooby-dev/jooby-codec';
import AnalogUnknownCommand from '@jooby-dev/jooby-codec/analog/UnknownCommand.js';
import ObisObserverUnknownCommand from '@jooby-dev/jooby-codec/obis-observer/UnknownCommand.js';

import {TCommandType} from '../types.js';

import {COMMAND_TYPE_ANALOG, COMMAND_TYPE_OBIS_OBSERVER} from '../constants.js';


const {directions} = joobyCodec.analog.constants;

const unknownCommandClassMap = {
    [COMMAND_TYPE_ANALOG]: AnalogUnknownCommand,
    [COMMAND_TYPE_OBIS_OBSERVER]: ObisObserverUnknownCommand
};

const isUnknownCommandClassOrInstanceOf = (command: object, commandType: TCommandType) => {
    const UnknownCommand = unknownCommandClassMap[commandType];

    if (command === UnknownCommand || command instanceof UnknownCommand) {
        return true;
    }

    return false;
};

const createCommandDirectionIcon = (command: object, commandType: TCommandType) => {
    if (isUnknownCommandClassOrInstanceOf(command, commandType)) {
        return <QuestionMarkIcon sx={{mr: 2, color: 'grey.700'}}/>;
    }

    if (command.directionType === directions.UPLINK) {
        return <ArrowDownwardIcon sx={{mr: 2, transform: 'rotate(180deg)', color: `${yellow[800]}`}}/>;
    }

    return <ArrowDownwardIcon color="success" sx={{mr: 2}}/>;
};


export default createCommandDirectionIcon;
