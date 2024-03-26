import {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import * as joobyCodec from '@jooby-dev/jooby-codec';
import {directions} from '@jooby-dev/jooby-codec/constants/index.js';
import {v4 as uuidv4} from 'uuid';
import {
    Box,
    Typography,
    InputAdornment,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel
} from '@mui/material';

import {
    Clear as ClearIcon
} from '@mui/icons-material';

import removeComments from '../utils/removeComments.js';

import {useSnackbar} from '../contexts/SnackbarContext.jsx';
import {CommandTypeContext} from '../contexts/CommandTypeContext.jsx';

import IconButtonWithTooltip from './IconButtonWithTooltip.jsx';
import TextField from './TextField.jsx';
import Button from './Button.jsx';

import {
    SEVERITY_TYPE_WARNING,
    COMMAND_TYPE_ANALOG,
    COMMAND_TYPE_MTX,
    ACCESS_KEY_LENGTH_BYTES,
    DEFAULT_ACCESS_KEY,
    directionNames
} from '../constants.js';

import getHardwareType from '../utils/getHardwareType.js';
import getHardwareTypeName from '../utils/getHardwareTypeName.js';
import createCtrlEnterSubmitHandler from '../utils/createCtrlEnterSubmitHandler.js';
import isValidHex from '../utils/isValidHex.js';
import getLogType from '../utils/getLogType.js';


const base64ToHex = base64 => Array.from(atob(base64), char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');

const validators = {
    accessKey: hex => isValidHex(hex, ACCESS_KEY_LENGTH_BYTES)
};

const formats = {
    HEX: '0',
    BASE64: '1'
};

const defaults = {
    accessKey: DEFAULT_ACCESS_KEY
};

const parametersState = {
    direction: directions.DOWNLINK,
    accessKey: defaults.accessKey
};

const parameterErrorsState = {
    accessKey: false
};


const ParseSection = ( {setLogs, hardwareType} ) => {
    const {commandType} = useContext(CommandTypeContext);

    const [dump, setDump] = useState('');
    const [format, setFormat] = useState(formats.HEX);
    const [parameters, setParameters] = useState({...parametersState});
    const [parameterErrors, setParameterErrors] = useState({...parameterErrorsState});

    const showSnackbar = useSnackbar();

    // reset state when command type changes
    useEffect(
        () => {
            setDump('');
            setParameters({...parametersState});
            setParameterErrors({...parameterErrorsState});
        },
        [commandType]
    );

    const onFormatChange = event => {
        setFormat(event.target.value);
    };

    const onDumpChange = event => {
        setDump(event.target.value);
    };

    const onClearDumpClick = () => {
        setDump('');
    };

    const onParseClick = () => {
        if ( !dump || Object.values(parameterErrors).some(error => error) ) {
            return;
        }

        let hex;
        let data;
        let parseError;

        if ( format === formats.BASE64 ) {
            try {
                hex = base64ToHex(dump);
            } catch ( error ) {
                parseError = error;
            }
        } else {
            hex = removeComments(dump);
        }

        if ( !parseError ) {
            try {
                if ( commandType === COMMAND_TYPE_MTX ) {
                    data = joobyCodec[commandType].message.fromFrame(
                        joobyCodec.utils.getBytesFromHex(hex),
                        {
                            aesKey: joobyCodec.utils.getBytesFromHex(parameters.accessKey)
                        }
                    );
                } else {
                    data = joobyCodec[commandType].message.fromHex(
                        hex,
                        {
                            hardwareType: getHardwareType(hardwareType),
                            direction: commandType === COMMAND_TYPE_ANALOG ? parameters.direction : undefined
                        }
                    );
                }
            } catch ( error ) {
                parseError = error;
            }
        }

        if ( data ) {
            data.commands = data.commands.map(commandData => ({
                command: {
                    hasParameters: commandData.command.constructor.hasParameters,
                    id: commandData.command.constructor.id,
                    length: commandData.command.toBytes().length,
                    name: commandData.command.constructor.name,
                    directionType: commandData.command.constructor.directionType,
                    parameters: commandData.command.getParameters(),
                    hex: commandData.command.toHex()
                },
                id: uuidv4(),
                isExpanded: false
            }));
        }

        const logType = getLogType(commandType, parseError);

        const log = {
            commandType,
            hex,
            hardwareType: getHardwareTypeName(hardwareType),
            data: parseError ? null : data,
            date: new Date().toLocaleString(),
            errorMessage: parseError?.message,
            type: logType,
            id: uuidv4(),
            isExpanded: false,
            tags: ['parse', commandType, logType]
        };

        if ( commandType === COMMAND_TYPE_MTX && !parseError ) {
            log.frameParameters = {
                type: data.type,
                destination: data.destination,
                source: data.source,
                accessLevel: data.accessLevel,
                messageId: data.messageId
            };
        }

        setLogs(prevLogs => [log, ...prevLogs]);
    };

    const onControlBlur = event => {
        const {name, value} = event.target;

        if ( value.trim() === '' && name in defaults ) {
            setParameters(prevParameters => ({
                ...prevParameters,
                [name]: defaults[name]
            }));

            setParameterErrors(prevParameterErrors => ({
                ...prevParameterErrors,
                [name]: false
            }));

            showSnackbar({
                message: `"${name}" set to default of "${defaults[name]}".`,
                severity: SEVERITY_TYPE_WARNING
            });

            return;
        }

        if ( validators[name] ) {
            setParameterErrors(prevParameterErrors => ({
                ...prevParameterErrors,
                [name]: !validators[name](value)
            }));
        }
    };

    const onControlChange = event => {
        const {name, value} = event.target;

        setParameters(prevParameters => ({
            ...prevParameters,
            [name]: value
        }));
    };

    return (
        <>
            <Typography variant="h5">
                {
                    commandType === COMMAND_TYPE_MTX
                        ? 'Parse frame'
                        : 'Parse message'
                }
            </Typography>

            <div>
                <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', alignItems: 'center'}}>
                    <FormControl sx={{display: 'contents'}}>
                        <FormLabel id="dump-input-format" sx={{pr: 2}}>Format</FormLabel>
                        <RadioGroup
                            row
                            aria-label="dump-input-format"
                            name="format"
                            value={format}
                            onChange={onFormatChange}
                            sx={{display: 'contents'}}
                        >
                            <FormControlLabel value={formats.HEX} control={<Radio/>} label="hex"/>
                            <FormControlLabel value={formats.BASE64} control={<Radio/>} label="base64"/>
                        </RadioGroup>
                    </FormControl>

                    {commandType === COMMAND_TYPE_ANALOG && (
                        <FormControl sx={{display: 'contents'}}>
                            <FormLabel id="dump-input-direction" sx={{pr: 2}}>Direction</FormLabel>
                            <RadioGroup
                                row
                                aria-label="dump-input-direction"
                                name="direction"
                                value={parameters.direction}
                                onChange={onControlChange}
                                sx={{display: 'contents'}}
                            >
                                <FormControlLabel value={directions.DOWNLINK} control={<Radio/>} label={directionNames[directions.DOWNLINK]}/>
                                <FormControlLabel value={directions.UPLINK} control={<Radio/>} label={directionNames[directions.UPLINK]}/>
                            </RadioGroup>
                        </FormControl>
                    )}
                </Box>
            </div>

            {commandType === COMMAND_TYPE_MTX && (
                <div>
                    <TextField
                        type="text"
                        label="Access key"
                        value={parameters.accessKey}
                        error={parameterErrors.accessKey}
                        name="accessKey"
                        helperText="16-byte in hex format"
                        onChange={onControlChange}
                        onBlur={onControlBlur}
                    />
                </div>
            )}

            <div>
                <TextField
                    type="text"
                    label="Dump"
                    onChange={onDumpChange}
                    onKeyDown={createCtrlEnterSubmitHandler(onParseClick)}
                    multiline
                    minRows={1}
                    maxRows={12}
                    value={dump}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {dump && (
                                    <IconButtonWithTooltip title="Clear dump" onClick={onClearDumpClick}>
                                        <ClearIcon/>
                                    </IconButtonWithTooltip>
                                )}
                            </InputAdornment>
                        )
                    }}
                />
            </div>

            <div>
                <Button
                    fullWidth={true}
                    sx={{mb: 2}}
                    disabled={!dump || Object.values(parameterErrors).some(error => error)}
                    onClick={onParseClick}
                >
                    Parse
                </Button>
            </div>
        </>
    );
};

ParseSection.propTypes = {
    setLogs: PropTypes.func.isRequired,
    hardwareType: PropTypes.string
};


export default ParseSection;
