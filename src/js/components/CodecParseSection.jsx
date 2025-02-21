import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import * as joobyCodec from 'jooby-codec';
import * as frame from 'jooby-codec/mtx1/utils/frame.js';
import DataSegmentsCollector from 'jooby-codec/analog/utils/DataSegmentsCollector.js';
import {frameTypes} from 'jooby-codec/mtx1/constants/index.js';
import {hardwareTypes} from 'jooby-codec/analog/constants/index.js';
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

import {useSnackbar} from '../contexts/SnackbarContext.jsx';
import {useCommandType} from '../contexts/CommandTypeContext.jsx';
import {useCodecStore} from '../store/codec.js';

import removeComments from '../utils/removeComments.js';
import createCtrlEnterSubmitHandler from '../utils/createCtrlEnterSubmitHandler.js';
import isValidHex from '../utils/isValidHex.js';
import getLogType from '../utils/getLogType.js';
import isByteArray from '../utils/isByteArray.js';
import isMtx from '../utils/isMtx.js';
import isMtxLora from '../utils/isMtxLora.js';

import IconButtonWithTooltip from './IconButtonWithTooltip.jsx';
import TextField from './TextField.jsx';
import Button from './Button.jsx';

import {commands} from '../joobyCodec.js';
import {
    directionNames,
    directions,
    commandTypes,
    severityTypes,
    accessKey,
    unknownCommand,
    logTypes,
    framingFormats
} from '../constants/index.js';


const base64ToHex = base64 => Array.from(atob(base64), char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');

const validators = {
    accessKey: hex => isValidHex(hex, accessKey.LENGTH_BYTES)
};

const getDirectionFromFrame = parsedFrame => {
    const {type} = parsedFrame.header;

    if ( type === frameTypes.DATA_REQUEST ) {
        return directions.DOWNLINK;
    }

    if ( type === frameTypes.DATA_RESPONSE ) {
        return directions.UPLINK;
    }

    return null;
};

const processDataAndCreateLog = ({
    data,
    hex,
    direction,
    commandType,
    hardwareType,
    parseError,
    logType,
    isMtxLoraCheck
}) => {
    const preparedData = {};
    let logErrorMessage = parseError?.message;
    let message;

    if ( data && !logErrorMessage ) {
        const messageError = data.error;

        message = messageError ? data.message : data;

        if ( !message.commands.length ) {
            logErrorMessage = 'No commands found.';
            logType = logTypes.ERROR;
        }

        preparedData.commands = message.commands.map(commandData => {
            const {error} = commandData;
            const command = error ? commandData.command : commandData;
            const commandDetails = error ? null : commands[commandType][directionNames[direction]][command.name];
            const isByteArrayValid = isByteArray(command.bytes);

            return {
                command: {
                    error,
                    id: command.id,
                    name: command.name || unknownCommand.NAME,
                    hex: isByteArrayValid ? joobyCodec.utils.getHexFromBytes(command.bytes) : undefined,
                    length: isByteArrayValid ? command.bytes.length : undefined,
                    directionType: direction,
                    hasParameters: error ? undefined : commandDetails.hasParameters,
                    parameters: command.parameters || undefined
                },
                id: uuidv4(),
                isExpanded: false
            };
        });

        preparedData.lrc = message.lrc;
        preparedData.error = messageError;
    }

    const log = {
        commandType,
        hex,
        hardwareType,
        isMtxLora: isMtxLoraCheck,
        directionName: directionNames[direction],
        data: logErrorMessage ? undefined : preparedData,
        date: new Date().toLocaleString(),
        error: logErrorMessage,
        type: logType,
        id: uuidv4(),
        isExpanded: false,
        tags: ['parse', commandType, logType],
        frameParameters: {},
        messageParameters: {}
    };

    if (
        (commandType === commandTypes.MTX1 || commandType === commandTypes.MTX3)
        && data
        && !logErrorMessage
    ) {
        const frameData = data.frame?.header;

        log.frameParameters = {
            type: frameData?.type,
            destination: frameData?.destination,
            source: frameData?.source
        };

        log.messageParameters = {
            accessLevel: message.accessLevel,
            messageId: message.messageId
        };
    }

    return log;
};

const formats = {
    HEX: '0',
    BASE64: '1'
};

const defaults = {
    accessKey: accessKey.DEFAULT_HEX
};

const parametersState = {
    direction: directions.DOWNLINK,
    accessKey: defaults.accessKey
};

const parameterErrorsState = {
    accessKey: false
};

const obisObserverDownlinkCommandIds = Object.values(joobyCodec.obisObserver.commands.downlink).map(command => command.id);


const CodecParseSection = ( {setLogs, hardwareType} ) => {
    const {commandType} = useCommandType();
    const [framingFormat] = useCodecStore(state => [state.framingFormat]);

    const [dump, setDump] = useState('');
    const [format, setFormat] = useState(formats.HEX);
    const [parameters, setParameters] = useState({...parametersState});
    const [parameterErrors, setParameterErrors] = useState({...parameterErrorsState});

    const showSnackbar = useSnackbar();

    const isMtxLoraCheck = isMtxLora(commandType, framingFormat);

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

        const codec = joobyCodec[commandType];
        const hexLines = removeComments(dump).split('\n').map(line => line.trim()).filter(line => line);
        const aesKey = joobyCodec.utils.getBytesFromHex(parameters.accessKey);
        const collector = new DataSegmentsCollector();
        const newLogs = [];
        let mtxBuffer = [];
        let direction;

        hexLines.forEach(hexLine => {
            let hex = hexLine;
            let data;
            let parseError;

            if ( format === formats.BASE64 ) {
                try {
                    hex = base64ToHex(hexLine);
                } catch ( error ) {
                    parseError = error;
                }
            }

            if ( !parseError ) {
                const bytes = joobyCodec.utils.getBytesFromHex(hex);

                switch ( commandType ) {
                    case commandTypes.MTX1:
                    case commandTypes.MTX3: {
                        try {
                            switch ( framingFormat ) {
                                case framingFormats.HDLC: {
                                    const parsedFrame = frame.fromBytes(bytes);

                                    if ( parsedFrame.error ) {
                                        throw new Error(parsedFrame.error);
                                    }

                                    direction = getDirectionFromFrame(parsedFrame);

                                    if ( !direction ) {
                                        throw new Error(`Unknown frame type: ${parsedFrame.type}`);
                                    }

                                    data = codec.message[directionNames[direction]].fromBytes(parsedFrame.payload, {aesKey});
                                    data.frame = parsedFrame;

                                    break;
                                }

                                case framingFormats.NONE: {
                                    direction = Number(parameters.direction);
                                    data = joobyCodec.analog.message[directionNames[direction]].fromBytes(
                                        bytes,
                                        {hardwareType: hardwareTypes.MTXLORA}
                                    );

                                    if ( !data.error ) {
                                        data.commands.forEach(command => {
                                            if ( command.error ) {
                                                return;
                                            }

                                            if ( command.id === commands.analog[directionNames[direction]].dataSegment.id ) {
                                                mtxBuffer = mtxBuffer.concat(collector.push(command.parameters));
                                            }
                                        });
                                    }

                                    break;
                                }
                            }
                        } catch ( error ) {
                            parseError = error;
                        }

                        break;
                    }

                    case commandTypes.ANALOG:
                        try {
                            direction = Number(parameters.direction);
                            data = codec.message[directionNames[direction]].fromBytes(
                                bytes,
                                {hardwareType: hardwareType?.value}
                            );
                        } catch ( error ) {
                            parseError = error;
                        }

                        break;

                    case commandTypes.OBIS_OBSERVER:
                        try {
                            direction = directions.DOWNLINK;
                            data = codec.message[directionNames[direction]].fromBytes(bytes);
                        } catch ( error ) {
                            parseError = error;
                        }

                        if (
                            parseError
                            || !data.commands
                                .map(({error, command, id}) => (error ? command.id : id))
                                .some(id => obisObserverDownlinkCommandIds.includes(id))
                        ) {
                            parseError = null;
                            data = null;

                            try {
                                direction = directions.UPLINK;
                                data = codec.message[directionNames[direction]].fromBytes(bytes);
                            } catch ( error ) {
                                parseError = error;
                            }
                        }

                        break;
                }
            }

            newLogs.push(
                processDataAndCreateLog({
                    data,
                    hex,
                    direction,
                    parseError,
                    isMtxLoraCheck,
                    hardwareType: hardwareType?.value,
                    commandType: isMtxLoraCheck ? commandTypes.ANALOG : commandType,
                    logType: getLogType(commandType, parseError, framingFormat)
                })
            );
        });

        if ( isMtxLoraCheck ) {
            const isByteArrayValid = isByteArray(mtxBuffer);
            let data;
            let parseError;

            try {
                data = codec.message[directionNames[direction]].fromBytes(mtxBuffer, {aesKey});
            } catch ( error ) {
                parseError = error;
            }

            newLogs.push(
                processDataAndCreateLog({
                    data,
                    direction,
                    parseError,
                    isMtxLoraCheck,
                    commandType,
                    hardwareType: hardwareType?.value,
                    hex: isByteArrayValid ? joobyCodec.utils.getHexFromBytes(mtxBuffer) : undefined,
                    logType: getLogType(commandType, parseError)
                })
            );
        }

        setLogs(prevLogs => [...newLogs, ...prevLogs]);
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
                severity: severityTypes.WARNING
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
                {isMtx(commandType, framingFormat) ? 'Parse frames' : 'Parse messages'}
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

                    {(commandType === commandTypes.ANALOG || isMtxLoraCheck) && (
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

            {(commandType === commandTypes.MTX1 || commandType === commandTypes.MTX3) && (
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
                    helperText="Batch processing supported, each dump on a new line"
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
                    data-testid={'parse-button'}
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

CodecParseSection.propTypes = {
    setLogs: PropTypes.func.isRequired,
    hardwareType: PropTypes.object
};


export default CodecParseSection;
