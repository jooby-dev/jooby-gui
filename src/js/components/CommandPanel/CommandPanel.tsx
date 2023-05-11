import {useState, useEffect, useRef, useCallback} from 'react';
import {utils, message, constants} from 'jooby-codec';
import {v4 as uuidv4} from 'uuid';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {
    Autocomplete, Box, Typography, TextField, InputAdornment, ButtonGroup, Button, Popper,
    Grow, Paper, ClickAwayListener, MenuList, MenuItem, List, ListItem, ListItemText, Stack
} from '@mui/material';

import {
    Clear as ClearIcon, ArrowDropDown as ArrowDropDownIcon, Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';

import createCommandDirectionIcon from '../../utils/createCommandDirectionIcon.js';

import {useSnackbar} from '../../contexts/SnackbarContext.js';

import IconButtonWithTooltip from '../IconButtonWithTooltip.js';
import HighlightedText from '../HighlightedText.js';
import CommandParametersEditor from '../CommandParametersEditor/CommandParametersEditor.js';

import {TSetLogs, ILogItem} from '../../types.js';

import {
    hardwareTypeList, parseButtonNameMap, LOG_TYPE_ERROR, LOG_TYPE_MESSAGE, SEVERITY_TYPE_WARNING
} from '../../constants.js';

import getHardwareType from './utils/getHardwareType.js';
import getHardwareTypeName from './utils/getHardwareTypeName.js';
import createCtrlEnterSubmitHandler from './utils/createCtrlEnterSubmitHandler.js';

import {THandleChange} from './types';

import {preparedCommandList} from './constants';


const {AUTO, DOWNLINK, UPLINK} = constants.directions;
const {getHexFromBytes} = utils;


const CommandPanel = ({setLogs}: {setLogs: TSetLogs}) => {
    const [hardwareType, setHardwareType] = useState<object | null>(null);
    const [buffer, setBuffer] = useState('');
    const [selectedParseButtonIndex, setSelectedParseButtonIndex] = useState<typeof AUTO | typeof DOWNLINK | typeof UPLINK>(AUTO);
    const [popperWidth, setPopperWidth] = useState(0);
    const [isOpenParseButtonGroup, setIsOpenParseButtonGroup] = useState(false);
    const [commandList, setCommandList] = useState<Array<object>>([]);
    const [preparedCommands, setPreparedCommands] = useState<Array<object>>([]);
    const [command, setCommand] = useState<object | null>(null);
    const [commandExampleList, setCommandExampleList] = useState<Array<object>>([]);
    const [commandExample, setCommandExample] = useState<object | null>(null);
    const [parameters, setParameters] = useState('');
    const [editingCommandId, setEditingCommandId] = useState<string | null>(null);
    const [recentlyEditedCommandId, setRecentlyEditedCommandId] = useState<string | null>(null);

    const anchorButtonGroupListRef = useRef<HTMLDivElement | null>(null);
    const parametersTextFieldRef = useRef<HTMLInputElement>(null);

    const {showSnackbar} = useSnackbar();

    useEffect(
        () => {
            setCommandList(preparedCommandList);
        },
        []
    );

    useEffect(
        () => {
            if (anchorButtonGroupListRef.current) {
                setPopperWidth(anchorButtonGroupListRef.current.offsetWidth);
            }
        },
        [isOpenParseButtonGroup, anchorButtonGroupListRef]
    );

    const handleHardwareTypeChange: THandleChange = (event, newValue) => {
        setHardwareType(newValue);
    };

    const handleBufferChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuffer(event.target.value);
    };

    const handleClearBufferClick = () => {
        setBuffer('');
    };

    const handleParametersChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setParameters(event);
    }, []);

    const handleDeletePreparedCommandClick = (index: number) => {
        const newPreparedCommands = preparedCommands.filter((preparedCommand) => preparedCommand.id !== index);
        setPreparedCommands(newPreparedCommands);
    };

    const handleClearCommandListClick = () => {
        setPreparedCommands([]);
        setCommandList(preparedCommandList);
    };

    const handleAddToMessageClick = () => {
        if (!command || (!parameters && command.value.hasParameters)) {
            return;
        }

        const newPreparedCommands = [...preparedCommands];

        newPreparedCommands.push({
            command,
            parameters,
            id: uuidv4()
        });

        setPreparedCommands(newPreparedCommands);
        setCommandList(preparedCommandList);
    };

    const handleCommandExampleChange: THandleChange = (event, newValue) => {
        setCommandExample(newValue);

        if (!newValue) {
            return;
        }

        if (newValue.value.parameters) {
            setParameters(JSON.stringify(newValue.value.parameters, null, 4));
        }

        if (newValue.value.hardwareType) {
            const hardwareTypeData = hardwareTypeList.find(hardwareType => hardwareType.value === newValue.value.hardwareType);

            setHardwareType(hardwareTypeData);
            showSnackbar({message: `Hardware type has been changed to "${hardwareTypeData.label}"`, severity: SEVERITY_TYPE_WARNING});
        }

        setTimeout(() => {
            if (parametersTextFieldRef.current) {
                parametersTextFieldRef.current.focus();
            }
        }, 0);
    };

    const handleCommandChange: THandleChange = (event, newValue) => {
        setCommand(newValue);
        setParameters('');
        setCommandExample(null);
        setCommandExampleList(
            newValue?.value?.examples
                ? newValue.value.examples.map(example => ({value: example, label: example.name}))
                : []
        );

        setTimeout(() => {
            if (parametersTextFieldRef.current) {
                parametersTextFieldRef.current.focus();
            }
        }, 0);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        directionType: number
    ) => {
        setSelectedParseButtonIndex(directionType);
        setIsOpenParseButtonGroup(false);
    };

    const handleParseButtonGroupMenuClose = (event: Event) => {
        if (
            anchorButtonGroupListRef.current &&
            anchorButtonGroupListRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setIsOpenParseButtonGroup(false);
    };

    const handleToggleParseButtonGroup = () => {
        setIsOpenParseButtonGroup(prevIsOpenParseButtonGroup => !prevIsOpenParseButtonGroup);
    };

    const handleBuildClick = () => {
        let data;
        let messageHex;
        let commandParameters;
        let buildError: unknown;

        try {
            messageHex = message.toHex(preparedCommands.map(preparedCommand => {
                preparedCommand.parameters.trim() === ''
                    ? commandParameters = undefined
                    : eval(`commandParameters = ${preparedCommand.parameters}`);

                return new preparedCommand.command.value(commandParameters, getHardwareType(hardwareType));
            }));

            data = message.fromHex(messageHex, preparedCommands[0].command.value.directionType, getHardwareType(hardwareType));
        } catch (error) {
            buildError = error;
        }

        if (data) {
            data.commands = data.commands.map((commandData) => {
                return {
                    command: {
                        hasParameters: commandData.command.constructor.hasParameters,
                        id: commandData.command.constructor.id,
                        length: commandData.command.toBytes().length,
                        name: commandData.command.constructor.name,
                        directionType: commandData.command.constructor.directionType,
                        parameters: commandData.command.getParameters()
                    },
                    data: {
                        header: {
                            length: commandData.data.header.length,
                            hex: getHexFromBytes(commandData.data.header)
                        },
                        body: {
                            length: commandData.data.body.length,
                            hex: getHexFromBytes(commandData.data.body)
                        }
                    },
                    id: uuidv4()
                };
            });
        }

        const log: ILogItem = {
            hardwareType: getHardwareTypeName(hardwareType),
            buffer: messageHex,
            data: buildError ? null : data,
            date: new Date().toLocaleString(),
            errorMessage: buildError?.message,
            type: buildError ? LOG_TYPE_ERROR : LOG_TYPE_MESSAGE,
            id: uuidv4()
        };

        setLogs(prevLogs => [log, ...prevLogs]);
    };

    const handleParseClick = () => {
        if (!buffer) {
            return;
        }

        let data;
        let parseError: unknown;

        try {
            data = message.fromHex(buffer, Number(selectedParseButtonIndex), getHardwareType(hardwareType));

        } catch (error) {
            parseError = error;
        }

        if (data) {
            data.commands = data.commands.map((commandData) => ({
                command: {
                    hasParameters: commandData.command.constructor.hasParameters,
                    id: commandData.command.constructor.id,
                    length: commandData.command.toBytes().length,
                    name: commandData.command.constructor.name,
                    directionType: commandData.command.constructor.directionType,
                    parameters: commandData.command.getParameters()
                },
                data: {
                    header: {
                        length: commandData.data.header.length,
                        hex: getHexFromBytes(commandData.data.header)
                    },
                    body: {
                        length: commandData.data.body.length,
                        hex: getHexFromBytes(commandData.data.body)
                    }
                },
                id: uuidv4()
            }));
        }

        const log: ILogItem = {
            buffer,
            hardwareType: getHardwareTypeName(hardwareType),
            data: parseError ? null : data,
            date: new Date().toLocaleString(),
            errorMessage: parseError?.message,
            type: parseError ? LOG_TYPE_ERROR : LOG_TYPE_MESSAGE,
            id: uuidv4()
        };

        setLogs(prevLogs => [log, ...prevLogs]);
    };

    const onPreparedCommandDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const startIndex = result.source.index;
        const endIndex = result.destination.index;

        const updatedCommands = [...preparedCommands];
        const [removed] = updatedCommands.splice(startIndex, 1);
        updatedCommands.splice(endIndex, 0, removed);

        setPreparedCommands(updatedCommands);
    };

    const handleEditPreparedCommandClick = (index: string) => {
        const commandToEdit = preparedCommands.find((preparedCommand) => preparedCommand.id === index);

        if (commandToEdit) {
            handleCommandChange(null, commandToEdit.command);
            setParameters(commandToEdit.parameters);
            setEditingCommandId(index);
            setTimeout(() => {
                if (parametersTextFieldRef.current) {
                    parametersTextFieldRef.current.focus();
                }
            }, 0);
        }
    };

    const handleSaveEditedCommandClick = () => {
        if (editingCommandId !== null) {
            const updatedCommands = preparedCommands.map((preparedCommand) =>
                preparedCommand.id === editingCommandId ? {...preparedCommand, parameters: parameters} : preparedCommand
            );

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
                <Autocomplete
                    options={hardwareTypeList.sort((itemA, itemB) => itemA.label.localeCompare(itemB.label))}
                    size="small"
                    value={hardwareType}
                    onChange={handleHardwareTypeChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Hardware type"
                            variant="filled"
                            helperText="May be required for parsing and creating a message"
                        />
                    )}
                />

                <Typography variant="h5">Parse message</Typography>

                <Box>
                    <TextField
                        fullWidth={true}
                        sx={{'& .MuiInputBase-input': {fontFamily: 'Roboto Mono, monospace'}}}
                        spellCheck={false}
                        size="small"
                        label="Dump"
                        variant="filled"
                        onChange={handleBufferChange}
                        onKeyDown={createCtrlEnterSubmitHandler(handleParseClick)}
                        multiline
                        minRows={4}
                        maxRows={12}
                        value={buffer}
                        helperText="In a hex format"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {buffer && (
                                        <IconButtonWithTooltip
                                            title="Clear dump"
                                            onClick={handleClearBufferClick}
                                        >
                                            <ClearIcon/>
                                        </IconButtonWithTooltip>
                                    )}
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>

                <ButtonGroup
                    disabled={!buffer}
                    disableElevation
                    sx={{mb: 2}}
                    variant="contained"
                    ref={anchorButtonGroupListRef}
                    aria-label="parse button"
                >
                    <Button fullWidth onClick={handleParseClick}>{parseButtonNameMap[selectedParseButtonIndex]}</Button>
                    <Button
                        aria-controls={isOpenParseButtonGroup ? 'parse-button-group-menu' : undefined}
                        aria-expanded={isOpenParseButtonGroup ? 'true' : undefined}
                        aria-label="select parse strategy"
                        aria-haspopup="menu"
                        onClick={handleToggleParseButtonGroup}
                    >
                        <ArrowDropDownIcon/>
                    </Button>
                </ButtonGroup>
                <Popper
                    sx={{
                        zIndex: 1000, minWidth: `${popperWidth}px}`
                    }}
                    open={isOpenParseButtonGroup}
                    anchorEl={anchorButtonGroupListRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleParseButtonGroupMenuClose}>
                                    <MenuList id="parse-button-group-menu" autoFocusItem>
                                        {Object.entries(parseButtonNameMap).map(([directionType, buttonName], index) => (
                                            <MenuItem
                                                key={buttonName}
                                                selected={index === selectedParseButtonIndex}
                                                onClick={(event) => handleMenuItemClick(event, Number(directionType))}
                                            >
                                                {buttonName}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>

                <Typography variant="h5">Message creation</Typography>

                <Autocomplete
                    options={commandList.sort((itemA, itemB) => {
                        let compare = itemA.direction.localeCompare(itemB.direction);

                        if (compare === 0) {
                            compare = itemA.value.id - itemB.value.id;
                        }

                        return compare;
                    })}
                    getOptionDisabled={option => (
                        preparedCommands.length !== 0
                        && option.direction !== preparedCommands[0].command.direction
                    )}
                    groupBy={option => option.direction}
                    size="small"
                    value={command}
                    onChange={handleCommandChange}
                    disabled={editingCommandId !== null}
                    renderInput={(params) => (
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
                        renderInput={(params) => (
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
                        <Typography variant="h6" sx={{fontWeight: 400, display: 'flex', alignItems: 'center', gap: 1}}>
                            Message command list
                            {createCommandDirectionIcon(preparedCommands[0].command.value.directionType)}
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
                                    {(provided) => (
                                        <List
                                            dense
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
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
                                                    {(provided) => (
                                                        <ListItem
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            sx={{
                                                                '&:not(:last-child)': {
                                                                    borderBottomWidth: '1px',
                                                                    borderBottomStyle: 'solid',
                                                                    borderBottomColor: 'divider'
                                                                },
                                                                '&:hover': {backgroundColor: 'background.filledHover'},
                                                                '&:focus': {outline: 'none', backgroundColor: 'background.filledHover'},
                                                                backgroundColor: editingCommandId === preparedCommand.id
                                                                    ? 'background.filledHover'
                                                                    : recentlyEditedCommandId === preparedCommand.id
                                                                        ? 'success.light'
                                                                        : 'background.filled',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                transition: 'background-color 0.3s'
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={
                                                                    <Box component="span" sx={{wordBreak: 'break-word'}}>
                                                                        <HighlightedText>
                                                                            {preparedCommand.command.value.name}
                                                                        </HighlightedText>
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
                                            {provided.placeholder}
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


export default CommandPanel;