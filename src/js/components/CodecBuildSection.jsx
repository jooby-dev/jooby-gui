import {useState, useEffect, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import * as joobyCodec from 'jooby-codec';
import * as frame from 'jooby-codec/mtx1/utils/frame.js';
import {splitBytesToDataSegments} from 'jooby-codec/analog/utils/splitBytesToDataSegments.js';
import {frameTypes, accessLevels} from 'jooby-codec/mtx1/constants/index.js';
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
import setFocus from '../utils/setFocus.js';
import isMtx from '../utils/isMtx.js';
import isMtxLora from '../utils/isMtxLora.js';

import {useSnackbar} from '../contexts/SnackbarContext.jsx';
import {useCommandType} from '../contexts/CommandTypeContext.jsx';
import {useCodecBuildPrefillData} from '../contexts/CodecBuildPrefillDataContext.jsx';
import {useCodecStore} from '../store/codec.js';

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
    accessKey,
    codecBuildDefaults,
    framingFormats
} from '../constants/index.js';

import isValidHex from '../utils/isValidHex.js';
import isValidNumber from '../utils/isValidNumber.js';
import cleanHexString from '../utils/cleanHexString.js';
import getLogType from '../utils/getLogType.js';
import isByteArray from '../utils/isByteArray.js';


const resolveParameters = ( parameters, commandType, framingFormat ) => {
    const resolvedParameters = {
        accessLevel: parameters.accessLevel,
        messageId: parameters.messageId,
        accessKey: parameters.accessKey,
        segmentationSessionId: parameters.segmentationSessionId,
        maxSegmentSize: parameters.maxSegmentSize
    };

    if ( commandType === commandTypes.MTX1 || commandType === commandTypes.MTX3 ) {
        return framingFormat === framingFormats.NONE
            ? resolvedParameters
            : {
                ...resolvedParameters,
                source: parameters.source,
                destination: parameters.destination
            };
    }

    return {};
};

const sortCommandExamples = examples => examples.sort((itemA, itemB) => itemA.label.localeCompare(itemB.label));

const incrementMessageId = messageId => (parseInt(messageId, 10) + 1) % BYTE_RANGE_LIMIT;

const validateMessageId = value => isValidNumber(value, MESSAGE_ID_MIN_VALUE, MESSAGE_ID_MAX_VALUE);

const validators = {
    source: hex => isValidNumber(parseInt(cleanHexString(hex), 16), SOURCE_ADDRESS_MIN_VALUE, SOURCE_ADDRESS_MAX_VALUE),
    destination: hex => isValidNumber(parseInt(cleanHexString(hex), 16), DESTINATION_ADDRESS_MIN_VALUE, DESTINATION_ADDRESS_MAX_VALUE),
    accessKey: hex => isValidHex(hex, accessKey.LENGTH_BYTES),
    messageId: validateMessageId,
    segmentationSessionId: validateMessageId,
    maxSegmentSize: value => isValidNumber(value, SEGMENT_MIN_VALUE, SEGMENT_MAX_VALUE)
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
    logType,
    isMtxLoraCheck
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
        hardwareType,
        directionName,
        isMtxLora: isMtxLoraCheck,
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

    if (
        ( commandType === commandTypes.MTX1 || commandType === commandTypes.MTX3 )
        && !buildError
    ) {
        log.frameParameters = {
            type: frameType,
            destination: parameters.destination ? parseInt(cleanHexString(parameters.destination), 16) : undefined,
            source: parameters.source ? parseInt(cleanHexString(parameters.source), 16) : undefined
        };

        log.messageParameters = {
            accessLevel: Number(parameters.accessLevel),
            accessKey: parameters.accessKey,
            segmentationSessionId: Number(parameters.segmentationSessionId),
            maxSegmentSize: Number(parameters.maxSegmentSize),
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
const SEGMENT_MIN_VALUE = 16;
const SEGMENT_MAX_VALUE = 64;

const parameterErrorsState = {
    source: false,
    destination: false,
    accessKey: false,
    messageId: false,
    segmentationSessionId: false,
    maxSegmentSize: false
};


const CodecBuildSection = ( {setLogs, hardwareType, setHardwareType} ) => {
    const {commandType} = useCommandType();
    const {prefillData} = useCodecBuildPrefillData();
    const [framingFormat] = useCodecStore(state => [state.framingFormat]);

    const [commandList, setCommandList] = useState(commandTypeConfigMap[commandType].preparedCommandList);
    const [preparedCommands, setPreparedCommands] = useState([]);
    const [command, setCommand] = useState(null);
    const [commandExampleList, setCommandExampleList] = useState([]);
    const [commandExample, setCommandExample] = useState(null);
    const [commandParameters, setCommandParameters] = useState('');
    const [commandParametersError, setCommandParametersError] = useState(false);
    const [editingCommandId, setEditingCommandId] = useState(null);
    const [recentlyEditedCommandId, setRecentlyEditedCommandId] = useState(null);
    const [parameters, setParameters] = useState({...codecBuildDefaults});
    const [parameterErrors, setParameterErrors] = useState({...parameterErrorsState});

    const commandParametersRef = useRef(null);

    const showSnackbar = useSnackbar();

    const isMtxLoraCheck = isMtxLora(commandType, framingFormat);
    const isMtxCheck = isMtx(commandType, framingFormat);

    // reset state when command type changes
    useEffect(
        () => {
            setCommandList(commandTypeConfigMap[commandType].preparedCommandList);
            setCommand(null);
            setEditingCommandId(null);
            setCommandParameters('');
            setCommandExample(null);
            setCommandExampleList([]);
            setPreparedCommands([]);
            setParameters({...codecBuildDefaults});
            setParameterErrors({...parameterErrorsState});
        },
        [commandType]
    );

    // prefill data from log
    useEffect(
        () => {
            if ( prefillData ) {
                // use setTimeout to ensure state reset completes before pre-filling the form
                setTimeout(
                    () => {
                        setCommand(null);
                        setEditingCommandId(null);
                        setCommandParameters('');
                        setCommandExample(null);
                        setCommandExampleList([]);
                        setPreparedCommands(prefillData.preparedCommands);
                        setParameters(prefillData.parameters);
                        setParameterErrors({...parameterErrorsState});
                    },
                    0
                );
            }
        },
        [prefillData]
    );

    const resolveCommandParametersAndHardwareType = ( commandData, commandExampleData ) => {
        if ( commandData.value.hasParameters ) {
            setCommandParameters(JSON.stringify(commandExampleData.value.parameters, null, 4));
        }

        if ( commandExampleData.value.config?.hardwareType ) {
            const hardwareTypeData = commandTypeConfigMap[commandType].hardwareTypeList
                .find(type => type.value === commandExampleData.value.config.hardwareType);

            setHardwareType(hardwareTypeData);
            showSnackbar({
                message: `Hardware type has been changed to "${hardwareTypeData.label}"`,
                severity: severityTypes.WARNING
            });
        }
    };

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
        setCommandList(commandTypeConfigMap[commandType].preparedCommandList);
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
        setCommandList(commandTypeConfigMap[commandType].preparedCommandList);
    };

    const onCommandExampleChange = ( event, newValue ) => {
        setCommandExample(newValue);

        if ( !newValue ) {
            return;
        }

        resolveCommandParametersAndHardwareType(command, newValue);
        setFocus(commandParametersRef);
    };

    const onCommandChange = ( event, newValue ) => {
        setCommand(newValue);
        setCommandParameters('');

        const newCommandExampleList = newValue?.value?.examples
            ? Object.entries(newValue.value.examples).map(([key, value]) => ({
                value,
                label: key
            }))
            : [];

        setCommandExampleList(newCommandExampleList);

        if ( newCommandExampleList.length ) {
            // select the first example when the command changes
            const newExample = sortCommandExamples(newCommandExampleList)[0];

            setCommandExample(newExample);
            resolveCommandParametersAndHardwareType(newValue, newExample);
        } else {
            setCommandExample(null);
        }

        setFocus(commandParametersRef);
    };

    const onBuildClick = () => {
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
                        hardwareType: hardwareType?.value
                    }
                };
            });

            // all commands in the message must be of the same direction
            const direction = preparedCommands[0].command.value.directionType;

            directionName = directionNames[direction];

            messageBytes = joobyCodec[commandType].message[directionName].toBytes(
                messageCommands,
                {
                    accessLevel: Number(parameters.accessLevel),
                    messageId: Number(parameters.messageId),
                    aesKey: joobyCodec.utils.getBytesFromHex(parameters.accessKey)
                }
            );

            data = joobyCodec[commandType].message[directionName].fromBytes(
                messageBytes,
                {
                    hardwareType: hardwareType?.value,
                    aesKey: joobyCodec.utils.getBytesFromHex(parameters.accessKey)
                }

            );

            if ( isMtxCheck ) {
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

        const bytes = isMtxCheck ? frameBytes : messageBytes;

        newLogs.push(
            processDataAndCreateLog({
                data,
                bytes,
                directionName,
                frameType,
                buildError,
                isMtxLoraCheck,
                commandType,
                hardwareType: hardwareType?.value,
                parameters: resolveParameters(parameters, commandType, framingFormat),
                logType: getLogType(commandType, buildError, framingFormat)
            })
        );

        if ( !buildError && isMtxLoraCheck ) {
            let segments;

            try {
                segments = splitBytesToDataSegments(
                    bytes,
                    {
                        segmentationSessionId: Number(parameters.segmentationSessionId),
                        maxSegmentSize: parameters.maxSegmentSize
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
                        isMtxLoraCheck,
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
                            isMtxLoraCheck,
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

        if ( value.trim() === '' && name in codecBuildDefaults ) {
            setParameters(prevParameters => ({
                ...prevParameters,
                [name]: codecBuildDefaults[name]
            }));

            setParameterErrors(prevParameterErrors => ({
                ...prevParameterErrors,
                [name]: false
            }));

            showSnackbar({
                message: `"${name}" set to default of "${codecBuildDefaults[name]}".`,
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

    const restoreCommandParameters = useCallback(
        () => {
            if ( commandExample ) {
                setCommandParameters(JSON.stringify(commandExample.value.parameters, null, 4));
                setFocus(commandParametersRef);
            }
        },
        [commandExample]
    );

    return (
        <>
            <Typography variant="h5">
                {isMtxCheck ? 'Create frame' : 'Create message'}
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
                    options={sortCommandExamples(commandExampleList)}
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
                        onClear={setCommandExample}
                        onRestore={restoreCommandParameters}
                        onSubmit={editingCommandId ? onSaveEditedCommandClick : onAddToMessageClick}
                        commandType={commandType}
                        isExampleSelected={!!commandExample}
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
                            <Button
                                data-testid={'save-edited-command-button'}
                                onClick={onSaveEditedCommandClick}
                                disabled={commandParametersError}
                            >
                                Save
                            </Button>
                            <Button
                                data-testid={'cancel-edited-command-button'}
                                variant="outlined"
                                onClick={onCancelEditingCommandClick}
                            >
                                Cancel
                            </Button>
                        </>
                    )
                }

            </Box>

            {preparedCommands.length > 0 && (
                <>
                    <Typography variant="h6" sx={{fontWeight: 400, display: 'flex', alignItems: 'center'}}>
                        {createDirectionIcon(preparedCommands[0].command.value.directionType)}
                        {isMtxCheck ? 'Frame' : 'Message'}
                    </Typography>

                    {(commandType === commandTypes.MTX1 || commandType === commandTypes.MTX3) && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            {isMtxCheck && (
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

                            {(commandType === commandTypes.MTX1 || commandType === commandTypes.MTX3) && (
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

                            {isMtxLoraCheck && (
                                <>
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

                                    <TextField
                                        label="Max segment size"
                                        value={parameters.maxSegmentSize}
                                        error={parameterErrors.maxSegmentSize}
                                        name="maxSegmentSize"
                                        helperText={`in decimal format (${SEGMENT_MIN_VALUE}-${SEGMENT_MAX_VALUE})`}
                                        onChange={onControlChange}
                                        onBlur={onControlBlur}
                                        suffix="bytes"
                                        min={SEGMENT_MIN_VALUE}
                                        max={SEGMENT_MAX_VALUE}
                                    />
                                </>
                            )}
                        </Box>
                    )}

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
                                {isMtxCheck ? 'Build frame' : 'Build message'}
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
