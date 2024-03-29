import {useState, useEffect, useRef, useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import * as joobyCodec from '@jooby-dev/jooby-codec';
import {v4 as uuidv4} from 'uuid';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {
    Autocomplete,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Stack,
    Select,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';

import {
    Clear as ClearIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';

import createCommandDirectionIcon from '../../utils/createCommandDirectionIcon.jsx';
import removeComments from '../../utils/removeComments.js';

import {useSnackbar} from '../../contexts/SnackbarContext.jsx';
import {CommandTypeContext} from '../../contexts/CommandTypeContext.jsx';

import IconButtonWithTooltip from '../IconButtonWithTooltip.jsx';
import HighlightedText from '../HighlightedText.jsx';
import CommandParametersEditor from '../CommandParametersEditor/CommandParametersEditor.jsx';

import {
    LOG_TYPE_ERROR,
    LOG_TYPE_MESSAGE,
    SEVERITY_TYPE_WARNING,
    COMMAND_TYPE_ANALOG,
    COMMAND_TYPE_OBIS_OBSERVER,
    commandTypeConfigMap
} from '../../constants.js';

import getHardwareType from './utils/getHardwareType.js';
import getHardwareTypeName from './utils/getHardwareTypeName.js';
import createCtrlEnterSubmitHandler from './utils/createCtrlEnterSubmitHandler.js';
import hasHardwareTypeInCommandType from '../../utils/hasHardwareTypeInCommandType.js';


const base64ToHex = base64 => Array.from(atob(base64), char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');

const getBackgroundColor = ( preparedCommand, editingCommandId, recentlyEditedCommandId ) => {
    if ( editingCommandId === preparedCommand.id ) {
        return 'background.filledHover';
    }

    if ( recentlyEditedCommandId === preparedCommand.id ) {
        return 'success.light';
    }

    return 'background.filled';
};

const dumpInputFormats = {
    HEX: '0',
    BASE64: '1'
};

const CommandPanel = ( {setLogs} ) => {
    const {commandType, setCommandType} = useContext(CommandTypeContext);

    const [hardwareType, setHardwareType] = useState(null);
    const [dump, setDump] = useState('');
    const [commandList, setCommandList] = useState(
        commandTypeConfigMap[commandType].preparedCommandList
    );
    const [preparedCommands, setPreparedCommands] = useState([]);
    const [command, setCommand] = useState(null);
    const [commandExampleList, setCommandExampleList] = useState([]);
    const [commandExample, setCommandExample] = useState(null);
    const [parameters, setParameters] = useState('');
    const [editingCommandId, setEditingCommandId] = useState(null);
    const [recentlyEditedCommandId, setRecentlyEditedCommandId] = useState(null);
    const [dumpInputFormat, setDumpInputFormat] = useState(dumpInputFormats.HEX);

    const parametersTextFieldRef = useRef(null);

    const showSnackbar = useSnackbar();

    // reset state when command type changes
    useEffect(
        () => {
            setCommandList(commandTypeConfigMap[commandType].preparedCommandList);
            setCommand(null);
            setEditingCommandId(null);
            setParameters('');
            setDump('');
            setHardwareType(null);
            setCommandExample(null);
            setCommandExampleList([]);
            setPreparedCommands([]);
        },
        [commandType]
    );

    const handleParseFormatChange = event => {
        setDumpInputFormat(event.target.value);
    };

    const handleCommandTypeChange = event => {
        setCommandType(event.target.value);
    };

    const handleHardwareTypeChange = ( event, newValue ) => {
        setHardwareType(newValue);
    };

    const handleHexChange = event => {
        setDump(event.target.value);
    };

    const handleClearHexClick = () => {
        setDump('');
    };

    const handleParametersChange = useCallback(
        event => {
            setParameters(event);
        },
        []
    );

    const handleDeletePreparedCommandClick = index => {
        const newPreparedCommands = preparedCommands.filter(preparedCommand => preparedCommand.id !== index);

        setPreparedCommands(newPreparedCommands);
    };

    const handleClearCommandListClick = () => {
        setPreparedCommands([]);
        setCommandList(commandTypeConfigMap[commandType].preparedCommandList);
    };

    const handleAddToMessageClick = () => {
        if ( !command || (!parameters && command.value.hasParameters) ) {
            return;
        }

        const newPreparedCommands = [...preparedCommands];

        newPreparedCommands.push({
            command,
            parameters,
            id: uuidv4()
        });

        setPreparedCommands(newPreparedCommands);
        setCommandList(commandTypeConfigMap[commandType].preparedCommandList);
    };

    const handleCommandExampleChange = ( event, newValue ) => {
        setCommandExample(newValue);

        if ( !newValue ) {
            return;
        }

        if ( newValue.value.parameters ) {
            setParameters(JSON.stringify(newValue.value.parameters, null, 4));
        }

        if ( newValue.value.config?.hardwareType ) {
            const hardwareTypeData = commandTypeConfigMap[commandType].hardwareTypeList
                .find(type => type.value === newValue.value.config.hardwareType);

            setHardwareType(hardwareTypeData);
            showSnackbar({
                message: `Hardware type has been changed to "${hardwareTypeData.label}"`,
                severity: SEVERITY_TYPE_WARNING
            });
        }

        setTimeout(
            () => {
                if ( parametersTextFieldRef.current ) {
                    parametersTextFieldRef.current.focus();
                }
            },
            0
        );
    };

    const handleCommandChange = ( event, newValue ) => {
        setCommand(newValue);
        setParameters('');
        setCommandExample(null);
        setCommandExampleList(
            newValue?.value?.examples
                ? newValue.value.examples.map(example => ({
                    value: example,
                    label: example.name
                }))
                : []
        );

        setTimeout(
            () => {
                if ( parametersTextFieldRef.current ) {
                    parametersTextFieldRef.current.focus();
                }
            },
            0
        );
    };

    const handleBuildClick = () => {
        let data;
        let messageHex;
        let commandParameters;
        let buildError;

        try {
            messageHex = joobyCodec[commandType].message.toHex(preparedCommands.map(preparedCommand => {
                if ( preparedCommand.parameters.trim() === '' ) {
                    commandParameters = undefined;
                } else {
                    // eslint-disable-next-line no-eval
                    eval(`commandParameters = ${preparedCommand.parameters}`);
                }

                // eslint-disable-next-line new-cap
                return new preparedCommand.command.value(commandParameters, {hardwareType: getHardwareType(hardwareType)});
            }));

            data = joobyCodec[commandType].message.fromHex(messageHex, {hardwareType: getHardwareType(hardwareType)});
        } catch ( error ) {
            buildError = error;
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

        const log = {
            commandType,
            hardwareType: getHardwareTypeName(hardwareType),
            hex: messageHex,
            data: buildError ? null : data,
            date: new Date().toLocaleString(),
            errorMessage: buildError?.message,
            type: buildError ? LOG_TYPE_ERROR : LOG_TYPE_MESSAGE,
            id: uuidv4(),
            isExpanded: false,
            tags: ['build', commandType]
        };

        setLogs(prevLogs => [log, ...prevLogs]);
    };

    const handleParseClick = () => {
        if ( !dump ) {
            return;
        }

        let hex;
        let data;
        let parseError;

        if ( dumpInputFormat === dumpInputFormats.BASE64 ) {
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
                data = joobyCodec[commandType].message.fromHex(hex, {hardwareType: getHardwareType(hardwareType)});
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

        const log = {
            commandType,
            hex,
            hardwareType: getHardwareTypeName(hardwareType),
            data: parseError ? null : data,
            date: new Date().toLocaleString(),
            errorMessage: parseError?.message,
            type: parseError ? LOG_TYPE_ERROR : LOG_TYPE_MESSAGE,
            id: uuidv4(),
            isExpanded: false,
            tags: ['parse', commandType]
        };

        setLogs(prevLogs => [log, ...prevLogs]);
    };

    const onPreparedCommandDragEnd = result => {
        if ( !result.destination ) {
            return;
        }

        const startIndex = result.source.index;
        const endIndex = result.destination.index;

        const updatedCommands = [...preparedCommands];
        const [removed] = updatedCommands.splice(startIndex, 1);
        updatedCommands.splice(endIndex, 0, removed);

        setPreparedCommands(updatedCommands);
    };

    const handleEditPreparedCommandClick = index => {
        const commandToEdit = preparedCommands.find(preparedCommand => preparedCommand.id === index);

        if ( commandToEdit ) {
            handleCommandChange(null, commandToEdit.command);
            setParameters(commandToEdit.parameters);
            setEditingCommandId(index);
            setTimeout(
                () => {
                    if ( parametersTextFieldRef.current ) {
                        parametersTextFieldRef.current.focus();
                    }
                },
                0
            );
        }
    };

    const handleSaveEditedCommandClick = () => {
        if ( editingCommandId !== null ) {
            const updatedCommands = preparedCommands.map(preparedCommand => (
                preparedCommand.id === editingCommandId
                    ? {...preparedCommand, parameters}
                    : preparedCommand
            ));

            setPreparedCommands(updatedCommands);
            setEditingCommandId(null);
            setParameters('');
            setRecentlyEditedCommandId(editingCommandId);
            setTimeout(() => setRecentlyEditedCommandId(null), 2000);
        }
    };

    const handleCancelEditingCommandClick = () => {
        setEditingCommandId(null);
        setParameters('');
    };

    return (
        <Box sx={{display: 'flex', flex: '0 0 auto'}}>
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                gap: 2,
                width: '500px',
                flexDirection: 'column',
                pt: 2,
                position: 'sticky',
                top: 0,
                maxHeight: '100vh',
                overflowY: 'auto',
                minHeight: 0,
                '& > *': {minHeight: 0, flex: '0 0 auto', px: 2}
            }}>
                <Box>
                    <FormControl variant="filled" fullWidth={true}>
                        <InputLabel id="select-command-type-label">Codec class</InputLabel>
                        <Select
                            labelId="select-command-type-label"
                            id="select-command-type"
                            value={commandType}
                            onChange={handleCommandTypeChange}
                        >
                            <MenuItem value={COMMAND_TYPE_ANALOG}>{COMMAND_TYPE_ANALOG}</MenuItem>
                            <MenuItem value={COMMAND_TYPE_OBIS_OBSERVER}>{COMMAND_TYPE_OBIS_OBSERVER}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {hasHardwareTypeInCommandType(commandType) && (
                    <Autocomplete
                        options={commandTypeConfigMap[commandType].hardwareTypeList.sort((itemA, itemB) => itemA.label.localeCompare(itemB.label))}
                        size="small"
                        value={hardwareType}
                        onChange={handleHardwareTypeChange}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Hardware type"
                                variant="filled"
                                helperText="May be required for parsing and creating a message"
                            />
                        )}
                    />
                )}

                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant="h5">Parse message</Typography>
                    <RadioGroup
                        sx={{ml: 'auto'}}
                        row
                        aria-label="dump-input-format"
                        name="dump-input-format"
                        value={dumpInputFormat}
                        onChange={handleParseFormatChange}
                    >
                        <FormControlLabel value={dumpInputFormats.HEX} control={<Radio/>} label="Hex"/>
                        <FormControlLabel value={dumpInputFormats.BASE64} control={<Radio/>} label="Base64"/>
                    </RadioGroup>
                </Box>

                <Box>
                    <TextField
                        fullWidth={true}
                        sx={{'& .MuiInputBase-input': {fontFamily: 'Roboto Mono, monospace'}}}
                        spellCheck={false}
                        size="small"
                        label="Dump"
                        variant="filled"
                        onChange={handleHexChange}
                        onKeyDown={createCtrlEnterSubmitHandler(handleParseClick)}
                        multiline
                        minRows={4}
                        maxRows={12}
                        value={dump}
                        helperText="In a hex or base64 format"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {dump && (
                                        <IconButtonWithTooltip title="Clear dump" onClick={handleClearHexClick}>
                                            <ClearIcon/>
                                        </IconButtonWithTooltip>
                                    )}
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>

                <Box>
                    <Button
                        fullWidth={true}
                        sx={{mb: 2}}
                        disabled={!dump}
                        variant="contained"
                        color="primary"
                        disableElevation
                        onClick={handleParseClick}
                    >
                        Parse
                    </Button>
                </Box>

                <Typography variant="h5">Message creation</Typography>

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
                    onChange={handleCommandChange}
                    disabled={editingCommandId !== null}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Command"
                            variant="filled"
                            helperText="Commands in the message must be of the same direction"
                        />
                    )}
                />

                {commandExampleList.length !== 0 && (
                    <Autocomplete
                        options={commandExampleList.sort((itemA, itemB) => itemA.label.localeCompare(itemB.label))}
                        size="small"
                        value={commandExample}
                        onChange={handleCommandExampleChange}
                        disabled={editingCommandId !== null}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Example"
                                variant="filled"
                                helperText="Can be used to simplify the creation of a command"
                            />
                        )}
                    />
                )}

                {command && (
                    <Box>
                        <CommandParametersEditor
                            value={parameters}
                            onChange={handleParametersChange}
                            disabled={!command.value.hasParameters}
                            inputRef={parametersTextFieldRef}
                            command={command}
                            onSubmit={
                                editingCommandId
                                    ? handleSaveEditedCommandClick
                                    : handleAddToMessageClick
                            }
                            commandType={commandType}
                        />
                    </Box>
                )}

                <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2, '& > *': {flexGrow: 1}}}>
                    {editingCommandId === null
                        ? (
                            <Button
                                disabled={!command || (!parameters && command.value.hasParameters)}
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={handleAddToMessageClick}
                            >
                                Add command
                            </Button>
                        )
                        : (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    onClick={handleSaveEditedCommandClick}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    disableElevation
                                    onClick={handleCancelEditingCommandClick}
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
                            {createCommandDirectionIcon(preparedCommands[0].command.value, commandType)}
                            Message command list
                        </Typography>

                        <Box sx={{
                            flex: '1 1 auto',
                            minHeight: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <DragDropContext onDragEnd={onPreparedCommandDragEnd}>
                                <Droppable droppableId="preparedCommandList">
                                    {droppableProvided => (
                                        <List
                                            dense
                                            ref={droppableProvided.innerRef}
                                            {...droppableProvided.droppableProps}
                                            sx={{
                                                maxHeight: '100%',
                                                overflow: 'auto',
                                                p: 0,
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            {preparedCommands.map((preparedCommand, index) => (
                                                <Draggable key={preparedCommand.id} draggableId={preparedCommand.id} index={index}>
                                                    {draggableProvided => (
                                                        <ListItem
                                                            ref={draggableProvided.innerRef}
                                                            {...draggableProvided.draggableProps}
                                                            {...draggableProvided.dragHandleProps}
                                                            sx={{
                                                                '&:not(:last-child)': {
                                                                    borderBottomWidth: '1px',
                                                                    borderBottomStyle: 'solid',
                                                                    borderBottomColor: 'divider'
                                                                },
                                                                '&:hover': {backgroundColor: 'background.filledHover'},
                                                                '&:focus': {outline: 'none', backgroundColor: 'background.filledHover'},
                                                                backgroundColor: getBackgroundColor(
                                                                    preparedCommand,
                                                                    editingCommandId,
                                                                    recentlyEditedCommandId
                                                                ),
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                transition: 'background-color 0.3s'
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={
                                                                    <Box component="span" sx={{wordBreak: 'break-word'}}>
                                                                        <HighlightedText>{preparedCommand.command.value.name}</HighlightedText>
                                                                    </Box>
                                                                }
                                                                secondary={
                                                                    <Box component="span" sx={{wordBreak: 'break-word'}}>
                                                                        <HighlightedText
                                                                            isMonospacedFont={true}
                                                                            fontWeight="fontWeightRegular"
                                                                            fontSize="0.75rem"
                                                                        >
                                                                            {preparedCommand.parameters}
                                                                        </HighlightedText>
                                                                    </Box>
                                                                }
                                                                sx={{flexGrow: 1}}
                                                            />
                                                            <Stack direction="row">
                                                                <IconButtonWithTooltip
                                                                    title="Edit parameters"
                                                                    onClick={() => handleEditPreparedCommandClick(preparedCommand.id)}
                                                                    disabled={editingCommandId === preparedCommand.id}
                                                                    sx={{marginRight: 0}}
                                                                >
                                                                    <EditIcon/>
                                                                </IconButtonWithTooltip>

                                                                <IconButtonWithTooltip
                                                                    title="Delete command from message"
                                                                    onClick={() => handleDeletePreparedCommandClick(preparedCommand.id)}
                                                                    disabled={editingCommandId === preparedCommand.id}
                                                                    sx={{marginRight: 0}}
                                                                >
                                                                    <DeleteIcon/>
                                                                </IconButtonWithTooltip>
                                                            </Stack>
                                                        </ListItem>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {droppableProvided.placeholder}
                                        </List>
                                    )}
                                </Droppable>
                            </DragDropContext>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                mb: 2,
                                '& > *': {flexGrow: 1}
                            }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    onClick={handleBuildClick}
                                    disabled={editingCommandId !== null}
                                >
                                    Build message
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    onClick={handleClearCommandListClick}
                                    disabled={editingCommandId !== null}
                                >
                                    Clear list
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'sticky',
                    bottom: 0,
                    mt: 'auto',
                    px: 0,
                    py: 2,
                    backgroundColor: 'background.default',
                    borderTopColor: 'divider',
                    borderTopWidth: 1,
                    borderTopStyle: 'solid',
                    zIndex: 1000
                }}>
                    <a href="https://github.com/jooby-dev/jooby-gui" target="_blank" rel="noopener noreferrer">
                        <img
                            alt="GitHub stars"
                            src="https://img.shields.io/github/stars/jooby-dev/jooby-gui?style=social"
                            style={{display: 'block'}}
                        />
                    </a>
                </Box>
            </Box>
        </Box>
    );
};

CommandPanel.propTypes = {
    setLogs: PropTypes.func.isRequired
};


export default CommandPanel;
