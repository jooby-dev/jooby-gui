import {useState, useEffect, useRef, useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import * as joobyCodec from 'jooby-codec';
import * as frame from 'jooby-codec/mtx/utils/frame.js';
import {splitBytesToDataSegments} from 'jooby-codec/analog/utils/splitBytesToDataSegments.js';
import {frameTypes, accessLevels} from 'jooby-codec/mtx/constants/index.js';
import {hardwareTypes} from 'jooby-codec/analog/constants/index.js';
import {v4 as uuidv4} from 'uuid';
import {
    Autocomplete,
    Box,
    Typography,
    MenuItem,
    Stack,
    Select,
    FormControl,
    InputLabel,
    TextField as MuiTextField
} from '@mui/material';

import createDirectionIcon from '../utils/createDirectionIcon.jsx';

import {useSnackbar} from '../contexts/SnackbarContext.jsx';
import {CommandTypeContext} from '../contexts/CommandTypeContext.jsx';

import CommandParametersEditor from './CommandParametersEditor/CommandParametersEditor.jsx';
import Button from './Button.jsx';
import TextField from './TextField.jsx';
import CommandList from './CommandList.jsx';

import {commands, commandTypeConfigMap} from '../joobyCodec.js';
import {
    directionNames,
    directions,
    severityTypes,
    commandTypes,
    accessKey
} from '../constants/index.js';

import getHardwareType from '../utils/getHardwareType.js';
import getHardwareTypeName from '../utils/getHardwareTypeName.js';
import isValidHex from '../utils/isValidHex.js';
import isValidNumber from '../utils/isValidNumber.js';
import cleanHexString from '../utils/cleanHexString.js';
import getLogType from '../utils/getLogType.js';
import isByteArray from '../utils/isByteArray.js';


const resolveCommandType = commandType => (commandType === commandTypes.MTX_LORA ? commandTypes.MTX : commandType);

const resolveParameters = ( parameters, commandType ) => {
    const resolvedParameters = {
        accessLevel: parameters.accessLevel,
        messageId: parameters.messageId
    };

    if ( commandType === commandTypes.MTX_LORA ) {
        return resolvedParameters;
    }

    if ( commandType === commandTypes.MTX ) {
        return {
            ...resolvedParameters,
            source: parameters.source,
            destination: parameters.destination
        };
    }

    return {};
};

const incrementMessageId = messageId => (parseInt(messageId, 10) + 1) % BYTE_RANGE_LIMIT;

const validateMessageId = value => isValidNumber(value, MESSAGE_ID_MIN_VALUE, MESSAGE_ID_MAX_VALUE);

const validators = {
    source: hex => isValidNumber(parseInt(cleanHexString(hex), 16), SOURCE_ADDRESS_MIN_VALUE, SOURCE_ADDRESS_MAX_VALUE),
    destination: hex => isValidNumber(parseInt(cleanHexString(hex), 16), DESTINATION_ADDRESS_MIN_VALUE, DESTINATION_ADDRESS_MAX_VALUE),
    accessKey: hex => isValidHex(hex, accessKey.LENGTH_BYTES),
    messageId: validateMessageId,
    segmentationSessionId: validateMessageId
};

const processDataAndCreateLog = ({
    data,
    bytes,
    parameters,
    directionName,
    commandType,
    hardwareType,
    frameType,
    buildError,
    logType
}) => {
    if ( data ) {
        data.commands = data.commands.map(commandData => {
            const commandDetails = commands[commandType][directionName][commandData.name];
            const isByteArrayValid = isByteArray(commandData.bytes);

            return {
                command: {
                    id: commandData.id,
                    name: commandData.name,
                    directionType: commandDetails.directionType,
                    hasParameters: commandDetails.hasParameters,
                    length: isByteArrayValid ? commandData.bytes.length : undefined,
                    parameters: commandData.parameters,
                    hex: isByteArrayValid ? joobyCodec.utils.getHexFromBytes(commandData.bytes) : undefined
                },
                id: uuidv4(),
                isExpanded: false
            };
        });
    }

    const log = {
        commandType,
        hardwareType: getHardwareTypeName(hardwareType),
        hex: !buildError && isByteArray(bytes) ? joobyCodec.utils.getHexFromBytes(bytes) : undefined,
        data: buildError ? undefined : data,
        date: new Date().toLocaleString(),
        error: buildError?.message,
        type: logType,
        id: uuidv4(),
        isExpanded: false,
        tags: ['build', commandType, logType],
        frameParameters: {},
        messageParameters: {}
    };

    if ( commandType === commandTypes.MTX && !buildError ) {
        log.frameParameters = {
            type: frameType,
            destination: parameters.destination ? parseInt(cleanHexString(parameters.destination), 16) : undefined,
            source: parameters.source ? parseInt(cleanHexString(parameters.source), 16) : undefined
        };

        log.messageParameters = {
            accessLevel: Number(parameters.accessLevel),
            messageId: Number(parameters.messageId)
        };
    }

    return log;
};

const accessLevelNames = {
    [accessLevels.UNENCRYPTED]: 'Unencrypted',
    [accessLevels.ROOT]: 'Root',
    [accessLevels.READ_WRITE]: 'Read and write',
    [accessLevels.READ_ONLY]: 'Read only'
};

const MESSAGE_ID_MIN_VALUE = 0;
const MESSAGE_ID_MAX_VALUE = 0xff;
const SOURCE_ADDRESS_MIN_VALUE = 0;
const SOURCE_ADDRESS_MAX_VALUE = 0xffff;
const DESTINATION_ADDRESS_MIN_VALUE = 0;
const DESTINATION_ADDRESS_MAX_VALUE = 0xffff;
const BYTE_RANGE_LIMIT = 256;
const MAX_SEGMENT_SIZE = 40;

const defaults = {
    source: 'ff fe',
    destination: 'ff ff',
    accessLevel: accessLevels.UNENCRYPTED,
    accessKey: accessKey.DEFAULT_HEX,
    messageId: 0,
    segmentationSessionId: 0
};

const parametersState = {
    source: defaults.source,
    destination: defaults.destination,
    accessLevel: defaults.accessLevel,
    accessKey: defaults.accessKey,
    messageId: defaults.messageId,
    segmentationSessionId: defaults.segmentationSessionId
};

const parameterErrorsState = {
    source: false,
    destination: false,
    accessKey: false,
    messageId: false,
    segmentationSessionId: false
};


const CodecBuildSection = ( {setLogs, hardwareType, setHardwareType} ) => {
    const {commandType} = useContext(CommandTypeContext);

    const [commandList, setCommandList] = useState(
        commandTypeConfigMap[resolveCommandType(commandType)].preparedCommandList
    );
    const [preparedCommands, setPreparedCommands] = useState([]);
    const [command, setCommand] = useState(null);
    const [commandExampleList, setCommandExampleList] = useState([]);
    const [commandExample, setCommandExample] = useState(null);
    const [commandParameters, setCommandParameters] = useState('');
    const [commandParametersError, setCommandParametersError] = useState(false);
    const [editingCommandId, setEditingCommandId] = useState(null);
    const [recentlyEditedCommandId, setRecentlyEditedCommandId] = useState(null);
    const [parameters, setParameters] = useState({...parametersState});
    const [parameterErrors, setParameterErrors] = useState({...parameterErrorsState});

    const commandParametersRef = useRef(null);

    const showSnackbar = useSnackbar();

    // reset state when command type changes
    useEffect(
        () => {
            setCommandList(commandTypeConfigMap[resolveCommandType(commandType)].preparedCommandList);
            setCommand(null);
            setEditingCommandId(null);
            setCommandParameters('');
            setCommandExample(null);
            setCommandExampleList([]);
            setPreparedCommands([]);
            setParameters({...parametersState});
            setParameterErrors({...parameterErrorsState});
        },
        [commandType]
    );

    const onParametersChange = useCallback(
        event => {
            if ( event.trim() === '' ) {
                setCommandParametersError(false);
                setCommandParameters('');

                return;
            }

            try {
                JSON.parse(event);
                setCommandParametersError(false);
            } catch ( error ) {
                setCommandParametersError(true);
            }

            setCommandParameters(event);
        },
        []
    );

    const onClearCommandListClick = () => {
        setPreparedCommands([]);
        setCommandList(commandTypeConfigMap[resolveCommandType(commandType)].preparedCommandList);
    };

    const onAddToMessageClick = () => {
        if (
            !command
            || (!commandParameters && command.value.hasParameters)
            || commandParametersError
        ) {
            return;
        }

        const newPreparedCommands = [...preparedCommands];

        newPreparedCommands.push({
            command,
            parameters: commandParameters,
            id: uuidv4()
        });

        setPreparedCommands(newPreparedCommands);
        setCommandList(commandTypeConfigMap[resolveCommandType(commandType)].preparedCommandList);
    };

    const onCommandExampleChange = ( event, newValue ) => {
        setCommandExample(newValue);

        if ( !newValue ) {
            return;
        }

        if ( command.value.hasParameters ) {
            // prepare parameters for editing
            setCommandParameters(JSON.stringify(newValue.value.parameters, null, 4));
        }

        if ( newValue.value.config?.hardwareType ) {
            const hardwareTypeData = commandTypeConfigMap[resolveCommandType(commandType)].hardwareTypeList
                .find(type => type.value === newValue.value.config.hardwareType);

            setHardwareType(hardwareTypeData);
            showSnackbar({
                message: `Hardware type has been changed to "${hardwareTypeData.label}"`,
                severity: severityTypes.WARNING
            });
        }

        setTimeout(
            () => {
                if ( commandParametersRef.current ) {
                    commandParametersRef.current.focus();
                }
            },
            0
        );
    };

    const onCommandChange = ( event, newValue ) => {
        setCommand(newValue);
        setCommandParameters('');
        setCommandExample(null);
        setCommandExampleList(
            newValue?.value?.examples
                ? Object.entries(newValue.value.examples).map(([key, value]) => ({
                    value,
                    label: key
                }))
                : []
        );

        setTimeout(
            () => {
                if ( commandParametersRef.current ) {
                    commandParametersRef.current.focus();
                }
            },
            0
        );
    };

    const onBuildClick = () => {
        const resolvedCommandType = resolveCommandType(commandType);
        const newLogs = [];
        let data;
        let messageBytes;
        let frameBytes;
        let frameType;
        let currentCommandParameters;
        let buildError;
        let directionName;

        try {
            const messageCommands = preparedCommands.map(preparedCommand => {
                if ( preparedCommand.parameters.trim() === '' ) {
                    currentCommandParameters = undefined;
                } else {
                    // eslint-disable-next-line no-eval
                    eval(`currentCommandParameters = ${preparedCommand.parameters}`);
                }

                return {
                    id: preparedCommand.command.value.id,
                    parameters: currentCommandParameters,
                    config: {
                        hardwareType: getHardwareType(hardwareType)
                    }
                };
            });

            // all commands in the message must be of the same direction
            const direction = preparedCommands[0].command.value.directionType;

            directionName = directionNames[direction];

            messageBytes = joobyCodec[resolvedCommandType].message[directionName].toBytes(
                messageCommands,
                {
                    accessLevel: Number(parameters.accessLevel),
                    messageId: Number(parameters.messageId),
                    aesKey: joobyCodec.utils.getBytesFromHex(parameters.accessKey)
                }
            );

            data = joobyCodec[resolvedCommandType].message[directionName].fromBytes(
                messageBytes,
                {
                    hardwareType: getHardwareType(hardwareType),
                    aesKey: joobyCodec.utils.getBytesFromHex(parameters.accessKey)
                }

            );

            if ( commandType === commandTypes.MTX ) {
                frameType = direction === directions.DOWNLINK ? frameTypes.DATA_REQUEST : frameTypes.DATA_RESPONSE;
                frameBytes = frame.toBytes(
                    messageBytes,
                    {
                        source: parseInt(cleanHexString(parameters.source), 16),
                        destination: parseInt(cleanHexString(parameters.destination), 16),
                        type: frameType
                    }
                );
            }
        } catch ( error ) {
            buildError = error;
            console.error(error);
        }

        const bytes = commandType === commandTypes.MTX ? frameBytes : messageBytes;

        newLogs.push(
            processDataAndCreateLog({
                data,
                bytes,
                directionName,
                hardwareType,
                frameType,
                buildError,
                commandType: resolvedCommandType,
                parameters: resolveParameters(parameters, commandType),
                logType: getLogType(commandType, buildError)
            })
        );

        if ( !buildError && commandType === commandTypes.MTX_LORA ) {
            let segments;

            try {
                segments = splitBytesToDataSegments(
                    bytes,
                    {
                        segmentationSessionId: Number(parameters.segmentationSessionId),
                        maxSegmentSize: MAX_SEGMENT_SIZE
                    }
                );
            } catch ( error ) {
                buildError = error;
                console.error(error);

                newLogs.push(
                    processDataAndCreateLog({
                        parameters,
                        directionName,
                        frameType,
                        buildError,
                        bytes,
                        data: undefined,
                        commandType: commandTypes.ANALOG,
                        hardwareType: hardwareTypes.MTXLORA,
                        logType: getLogType(commandType, buildError)
                    })
                );
            }

            if ( !buildError ) {
                segments.forEach(segmentParameters => {
                    const segmentCommand = {
                        id: commands.analog[directionName].dataSegment.id,
                        parameters: segmentParameters
                    };

                    try {
                        messageBytes = joobyCodec.analog.message[directionName].toBytes([segmentCommand]);
                        data = joobyCodec.analog.message[directionName].fromBytes(
                            messageBytes,
                            {hardwareType: hardwareTypes.MTXLORA}
                        );
                    } catch ( error ) {
                        buildError = error;
                        console.error(error);
                    }

                    newLogs.push(
                        processDataAndCreateLog({
                            data,
                            parameters,
                            directionName,
                            frameType,
                            buildError,
                            bytes: messageBytes,
                            commandType: commandTypes.ANALOG,
                            hardwareType: hardwareTypes.MTXLORA,
                            logType: getLogType(commandType, buildError)
                        })
                    );
                });

                if (
                    preparedCommands.some(preparedCommand => preparedCommand.command.value.isLoraOnly)
                    && parameters.accessLevel !== accessLevels.UNENCRYPTED
                ) {
                    const loraOnlyCommandNames = preparedCommands
                        .filter(preparedCommand => preparedCommand.command.value.isLoraOnly)
                        .map(preparedCommand => preparedCommand.command.value.name);

                    showSnackbar({
                        message: (
                            <Stack spacing={1}>
                                <div>LoRa only commands should be sent with unencrypted access level.</div>
                                <div>Current access level: {accessLevelNames[parameters.accessLevel]}.</div>
                                <div>LoRa only commands in the message: {loraOnlyCommandNames.join(', ')}.</div>
                            </Stack>
                        ),
                        severity: severityTypes.WARNING,
                        duration: 15000
                    });
                }
            }
        }

        setLogs(prevLogs => [...newLogs, ...prevLogs]);
        setParameters(prevParameters => ({
            ...prevParameters,
            messageId: incrementMessageId(prevParameters.messageId),
            segmentationSessionId: incrementMessageId(prevParameters.segmentationSessionId)
        }));
    };

    const onSaveEditedCommandClick = () => {
        if ( editingCommandId === null || commandParametersError ) {
            return;
        }

        const updatedCommands = preparedCommands.map(preparedCommand => (
            preparedCommand.id === editingCommandId
                ? {...preparedCommand, parameters: commandParameters}
                : preparedCommand
        ));

        setPreparedCommands(updatedCommands);
        setEditingCommandId(null);
        setCommandParameters('');
        setRecentlyEditedCommandId(editingCommandId);
        setTimeout(() => setRecentlyEditedCommandId(null), 2000);
    };

    const onCancelEditingCommandClick = () => {
        setEditingCommandId(null);
        setCommandParameters('');
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
                {
                    commandType === commandTypes.MTX
                        ? 'Create frame'
                        : 'Create message'
                }
            </Typography>

            <Autocomplete
                options={commandList.sort((itemA, itemB) => {
                    let compare = itemA.direction.localeCompare(itemB.direction);

                    if ( compare === 0 ) {
                        compare = itemA.value.id - itemB.value.id;
                    }

                    return compare;
                })}
                getOptionDisabled={option => (preparedCommands.length !== 0 && option.direction !== preparedCommands[0].command.direction)}
                groupBy={option => option.direction}
                size="small"
                value={command}
                onChange={onCommandChange}
                disabled={editingCommandId !== null}
                renderInput={params => (
                    <MuiTextField
                        {...params}
                        label="Command"
                        variant="standard"
                        helperText="Commands in the message must be of the same direction"
                    />
                )}
            />

            {commandExampleList.length !== 0 && (
                <Autocomplete
                    options={commandExampleList.sort((itemA, itemB) => itemA.label.localeCompare(itemB.label))}
                    size="small"
                    value={commandExample}
                    onChange={onCommandExampleChange}
                    disabled={editingCommandId !== null}
                    renderInput={params => (
                        <MuiTextField
                            {...params}
                            label="Example"
                            variant="standard"
                            helperText="Can be used to simplify the creation of a command"
                        />
                    )}
                />
            )}

            {command && (
                <div>
                    <CommandParametersEditor
                        value={commandParameters}
                        onChange={onParametersChange}
                        disabled={!command.value.hasParameters}
                        inputRef={commandParametersRef}
                        command={command}
                        onSubmit={
                            editingCommandId
                                ? onSaveEditedCommandClick
                                : onAddToMessageClick
                        }
                        commandType={commandType}
                    />
                </div>
            )}

            <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2, '& > *': {flexGrow: 1}}}>
                {editingCommandId === null
                    ? (
                        <Button
                            data-testid={'add-command-button'}
                            disabled={
                                !command
                                || (!commandParameters && command.value.hasParameters)
                                || commandParametersError
                            }
                            onClick={onAddToMessageClick}
                        >
                            Add command
                        </Button>
                    )
                    : (
                        <>
                            <Button data-testid={'save-edited-command-button'} onClick={onSaveEditedCommandClick} disabled={commandParametersError}>Save</Button>
                            <Button data-testid={'cancel-edited-command-button'} variant="outlined" onClick={onCancelEditingCommandClick}>Cancel</Button>
                        </>
                    )
                }

            </Box>

            {preparedCommands.length > 0 && (
                <>
                    <Typography variant="h6" sx={{fontWeight: 400, display: 'flex', alignItems: 'center'}}>
                        {createDirectionIcon(preparedCommands[0].command.value.directionType)}
                        {commandType === commandTypes.MTX ? 'Frame' : 'Message'}
                    </Typography>

                    {
                        (commandType === commandTypes.MTX || commandType === commandTypes.MTX_LORA) && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                {commandType === commandTypes.MTX && (
                                    <>
                                        <TextField
                                            type="text"
                                            label="Source address"
                                            value={parameters.source}
                                            error={parameterErrors.source}
                                            name="source"
                                            helperText="2-byte in hex format (0000-FFFF)"
                                            onChange={onControlChange}
                                            onBlur={onControlBlur}
                                        />

                                        <TextField
                                            type="text"
                                            label="Destination address"
                                            value={parameters.destination}
                                            error={parameterErrors.destination}
                                            name="destination"
                                            helperText="2-byte in hex format (0000-FFFF)"
                                            onChange={onControlChange}
                                            onBlur={onControlBlur}
                                        />
                                    </>
                                )}

                                {(commandType === commandTypes.MTX || commandType === commandTypes.MTX_LORA) && (
                                    <>
                                        <FormControl variant="standard" fullWidth={true}>
                                            <InputLabel id="select-access-level-label">Access level</InputLabel>
                                            <Select
                                                labelId="select-access-level-label"
                                                id="select-access-level"
                                                value={parameters.accessLevel}
                                                name="accessLevel"
                                                onChange={onControlChange}
                                            >
                                                {Object.entries(accessLevels).map(([key, value]) => (
                                                    <MenuItem key={key} value={value}>{accessLevelNames[value]}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            label="Access key"
                                            type="text"
                                            value={parameters.accessKey}
                                            error={parameterErrors.accessKey}
                                            name="accessKey"
                                            helperText="16-byte in hex format"
                                            onChange={onControlChange}
                                            onBlur={onControlBlur}
                                        />

                                        <TextField
                                            label="Message ID"
                                            value={parameters.messageId}
                                            error={parameterErrors.messageId}
                                            name="messageId"
                                            helperText="1-byte in decimal format (0-255)"
                                            onChange={onControlChange}
                                            onBlur={onControlBlur}
                                            min={MESSAGE_ID_MIN_VALUE}
                                            max={MESSAGE_ID_MAX_VALUE}
                                        />
                                    </>
                                )}

                                {commandType === commandTypes.MTX_LORA && (
                                    <TextField
                                        label="Segmentation session ID"
                                        value={parameters.segmentationSessionId}
                                        error={parameterErrors.segmentationSessionId}
                                        name="segmentationSessionId"
                                        helperText="1-byte in decimal format (0-255)"
                                        onChange={onControlChange}
                                        onBlur={onControlBlur}
                                        min={MESSAGE_ID_MIN_VALUE}
                                        max={MESSAGE_ID_MAX_VALUE}
                                    />
                                )}
                            </Box>
                        )
                    }

                    <Box sx={{
                        flex: '1 1 auto',
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <CommandList
                            setCommands={setPreparedCommands}
                            setCommandParameters={setCommandParameters}
                            setEditingId={setEditingCommandId}
                            onChange={onCommandChange}
                            commandParametersRef={commandParametersRef}
                            commands={preparedCommands}
                            editingId={editingCommandId}
                            recentlyEditedId={recentlyEditedCommandId}
                        />

                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            mb: 2,
                            '& > *': {flexGrow: 1}
                        }}>
                            <Button
                                onClick={onBuildClick}
                                disabled={
                                    editingCommandId !== null
                                    || Object.values(parameterErrors).some(error => error)
                                }
                            >
                                {
                                    commandType === commandTypes.MTX
                                        ? 'Build frame'
                                        : 'Build message'
                                }
                            </Button>

                            <Button onClick={onClearCommandListClick} disabled={editingCommandId !== null}>Clear commands</Button>
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
};

CodecBuildSection.propTypes = {
    setLogs: PropTypes.func.isRequired,
    hardwareType: PropTypes.object,
    setHardwareType: PropTypes.func.isRequired
};


export default CodecBuildSection;
