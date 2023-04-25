import {useState, useEffect, useRef} from 'react';
import {utils, message} from 'jooby-codec';
import {v4 as uuidv4} from 'uuid';

import {
    Autocomplete, Box, Typography, TextField, InputAdornment, ButtonGroup, Button, IconButton,
    Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, Link, List, ListItem, ListItemText,
    Divider
} from '@mui/material';

import {
    Clear as ClearIcon, ArrowDropDown as ArrowDropDownIcon, Delete as DeleteIcon,
    FormatAlignLeft as FormatAlignLeftIcon
} from '@mui/icons-material';

import {useSnackbar} from '../../contexts/SnackbarContext';

import HighlightedText from '../HighlightedText';

import {createCommandDocLink} from '../../utils';

import {SetLogs, Log} from '../../types';

import {
    hardwareTypeList, parseButtonNameMap, DIRECTION_TYPE_AUTO, LOG_TYPE_ERROR, LOG_TYPE_MESSAGE
} from '../../constants';

import {
    isValidJson, formatJson, getHardwareType, getHardwareTypeName, createCtrlEnterSubmitHandler
} from './utils';

import {
    HardwareType, HandleHardwareTypeChange, HandleBufferChange, HandleCommandExampleChange,
    SelectedParseButtonIndex, AnchorButtonGroupList, CommandExampleList, CommandExample,
    HandleParseButtonGroupMenuClose, HandleDeletePreparedCommandClick, HandleParametersChange,
    CommandList, PreparedCommands, HandleMenuItemClick, HandleCommandChange
} from './types';

import {preparedCommandList} from './constants';


const {getHexFromBytes} = utils;


const CommandPanel = ({setLogs}: {setLogs: SetLogs}) => {
    const [hardwareType, setHardwareType] = useState<HardwareType>(null);
    const [buffer, setBuffer] = useState('');
    const [selectedParseButtonIndex, setSelectedParseButtonIndex] = useState<SelectedParseButtonIndex>(DIRECTION_TYPE_AUTO);
    const [popperWidth, setPopperWidth] = useState(0);
    const [isOpenParseButtonGroup, setIsOpenParseButtonGroup] = useState(false);
    const [commandList, setCommandList] = useState<CommandList>([]);
    const [preparedCommands, setPreparedCommands] = useState<PreparedCommands>([]);
    const [command, setCommand] = useState<object | null>(null);
    const [commandExampleList, setCommandExampleList] = useState<CommandExampleList>([]);
    const [commandExample, setCommandExample] = useState<CommandExample>(null);
    const [parameters, setParameters] = useState('');

    const anchorButtonGroupListRef = useRef<AnchorButtonGroupList>(null);

    const {showSnackbar} = useSnackbar();

    useEffect(() => {
        setCommandList(preparedCommandList);
    }, []);

    useEffect(() => {
        if (anchorButtonGroupListRef.current) {
            setPopperWidth(anchorButtonGroupListRef.current.offsetWidth);
        }
    }, [isOpenParseButtonGroup, anchorButtonGroupListRef]);

    const handleHardwareTypeChange: HandleHardwareTypeChange = (event, newValue) => {
        setHardwareType(newValue);
    };

    const handleBufferChange: HandleBufferChange = (event) => {
        setBuffer(event.target.value);
    };

    const handleClearBufferClick = () => {
        setBuffer('');
    };

    const handleParametersChange: HandleParametersChange = (event) => {
        setParameters(event.target.value);
    };

    const handleClearParametersClick = () => {
        setParameters('');
    };

    const handleDeletePreparedCommandClick: HandleDeletePreparedCommandClick = (index) => {
        const newPreparedCommands = [...preparedCommands];

        newPreparedCommands.splice(index, 1);
        setPreparedCommands(newPreparedCommands);
    };

    const handleFormatParametersClick = () => {
        if (isValidJson(parameters)) {
            setParameters(formatJson(parameters));
        }
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

    const handleCommandExampleChange: HandleCommandExampleChange = (event, newValue) => {
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
    };

    const handleCommandChange: HandleCommandChange = (event, newValue) => {
        setCommand(newValue);
        setParameters('');
        setCommandExample(null);
        setCommandExampleList(
            newValue?.value?.examples
                ? newValue.value.examples.map(example => ({value: example, label: example.name}))
                : []
        );
    };

    const handleMenuItemClick: HandleMenuItemClick = (event, directionType) => {
        setSelectedParseButtonIndex(directionType);
        setIsOpenParseButtonGroup(false);
    };

    const handleParseButtonGroupMenuClose: HandleParseButtonGroupMenuClose = (event) => {
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

        const log: Log = {
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

        const log: Log = {
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
                                        <IconButton
                                            aria-label="clear buffer"
                                            onClick={handleClearBufferClick}
                                        >
                                            <ClearIcon fontSize="medium" />
                                        </IconButton>
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
                        <ArrowDropDownIcon />
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
                    options={commandList.sort((itemA, itemB) => itemA.direction.localeCompare(itemB.direction))}
                    getOptionDisabled={option => preparedCommands.length !== 0 && option.direction !== preparedCommands[0].command.direction}
                    groupBy={option => option.direction}
                    size="small"
                    value={command}
                    onChange={handleCommandChange}
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
                        <TextField
                            sx={{'& .MuiInputBase-input': {fontFamily: 'Roboto Mono, monospace'}}}
                            fullWidth={true}
                            disabled={!command.value.hasParameters}
                            label={command.value.hasParameters ? 'Parameters' : 'This command has no parameters'}
                            spellCheck={false}
                            variant="filled"
                            onChange={handleParametersChange}
                            onKeyDown={createCtrlEnterSubmitHandler(handleAddToMessageClick)}
                            multiline
                            minRows={4}
                            maxRows={12}
                            value={parameters}
                            helperText={
                                <>
                                        JSON/object with command parameters
                                    {command && (
                                        <>
                                            {' (see '}
                                            <Link
                                                href={createCommandDocLink(command.value)}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={event => event.stopPropagation()}
                                            >
                                                {command.label}
                                            </Link>
                                            {' documentation)'}
                                        </>
                                    )}
                                </>
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {parameters && (
                                            <Box display="flex" flexDirection="column">
                                                <IconButton
                                                    aria-label="clear parameters"
                                                    onClick={handleClearParametersClick}
                                                >
                                                    <ClearIcon fontSize="medium" />
                                                </IconButton>

                                                <IconButton
                                                    aria-label="format parameters"
                                                    onClick={handleFormatParametersClick}
                                                >
                                                    <FormatAlignLeftIcon fontSize="medium" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                )}

                <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2, '& > *': {flexGrow: 1}}}>
                    <Button
                        disabled={!command || (!parameters && command.value.hasParameters)}
                        variant="contained"
                        color="primary"
                        disableElevation
                        onClick={handleAddToMessageClick}
                    >
                                Add command
                    </Button>
                </Box>

                {preparedCommands.length > 0 && (
                    <>
                        <Typography variant="h5">Message command list</Typography>

                        <Box>
                            <List dense sx={{maxHeight: '200px', overflow: 'auto', p: 0, backgroundColor: 'background.filled'}}>
                                {preparedCommands.map((preparedCommand, index) => (
                                    <>
                                        <ListItem
                                            key={preparedCommand.id}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete command from message" onClick={() => handleDeletePreparedCommandClick(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <HighlightedText>{preparedCommand.command.value.name}</HighlightedText>
                                                        {` (${preparedCommand.command.direction})`}
                                                    </>
                                                }
                                                secondary={
                                                    <HighlightedText
                                                        isMonospacedFont={true}
                                                        fontWeight="fontWeightRegular"
                                                        fontSize="0.75rem"
                                                    >
                                                        {preparedCommand.parameters}
                                                    </HighlightedText>
                                                }
                                            />
                                        </ListItem>
                                        {index !== preparedCommands.length - 1 && <Divider component="li" />}
                                    </>
                                ))}
                            </List>
                        </Box>

                        <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2, '& > *': {flexGrow: 1}}}>
                            <Button
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={handleBuildClick}
                            >
                                        Build message
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={handleClearCommandListClick}
                            >
                                        Clear list
                            </Button>
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
                    borderTopStyle: 'solid'
                }}>
                    <a href="https://github.com/jooby-dev/jooby-gui" target="_blank" rel="noopener noreferrer">
                        <img alt="GitHub stars" src="https://img.shields.io/github/stars/jooby-dev/jooby-gui?style=social" style={{display: 'block'}} />
                    </a>
                </Box>
            </Box>
        </Box>
    );
};


export default CommandPanel;
