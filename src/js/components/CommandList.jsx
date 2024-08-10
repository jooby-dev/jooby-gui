import PropTypes from 'prop-types';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Stack
} from '@mui/material';

import {
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';

import IconButtonWithTooltip from './IconButtonWithTooltip.jsx';
import HighlightedText from './HighlightedText.jsx';


const getBackgroundColor = ( preparedCommand, editingId, recentlyEditedId ) => {
    if ( editingId === preparedCommand.id ) {
        return 'background.filledHover';
    }

    if ( recentlyEditedId === preparedCommand.id ) {
        return 'success.light';
    }

    return 'background.filled';
};


const CommandList = ({
    setCommands,
    setCommandParameters,
    setEditingId,
    onChange,
    commandParametersRef,
    commands,
    editingId,
    recentlyEditedId
}) => {
    const onDragEnd = result => {
        if ( !result.destination ) {
            return;
        }

        const startIndex = result.source.index;
        const endIndex = result.destination.index;

        const updatedCommands = [...commands];
        const [removed] = updatedCommands.splice(startIndex, 1);
        updatedCommands.splice(endIndex, 0, removed);

        setCommands(updatedCommands);
    };

    const onDelete = index => {
        const newPreparedCommands = commands.filter(preparedCommand => preparedCommand.id !== index);

        if ( editingId === index ) {
            setCommandParameters('');
            setEditingId(null);
            onChange(null, null);
        }

        setCommands(newPreparedCommands);
    };

    const onEdit = index => {
        const commandToEdit = commands.find(preparedCommand => preparedCommand.id === index);

        if ( commandToEdit ) {
            onChange(null, commandToEdit.command);
            setCommandParameters(commandToEdit.parameters);
            setEditingId(index);
            setTimeout(
                () => {
                    if ( commandParametersRef.current ) {
                        commandParametersRef.current.focus();
                    }
                },
                0
            );
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
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
                        {commands.map((command, index) => (
                            <Draggable key={command.id} draggableId={command.id} index={index}>
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
                                                command,
                                                editingId,
                                                recentlyEditedId
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
                                                    <HighlightedText>{command.command.value.name}</HighlightedText>
                                                </Box>
                                            }
                                            secondary={
                                                <Box component="span" sx={{wordBreak: 'break-word'}}>
                                                    <HighlightedText
                                                        isMonospacedFont={true}
                                                        fontWeight="fontWeightRegular"
                                                        fontSize="0.75rem"
                                                    >
                                                        {
                                                            command.parameters.trim() === ''
                                                                ? ''
                                                                : JSON.stringify(JSON.parse(command.parameters))
                                                        }
                                                    </HighlightedText>
                                                </Box>
                                            }
                                            sx={{flexGrow: 1}}
                                        />
                                        <Stack direction="row">
                                            <IconButtonWithTooltip
                                                title="Edit parameters"
                                                onClick={() => onEdit(command.id)}
                                                disabled={editingId === command.id}
                                                sx={{marginRight: 0}}
                                            >
                                                <EditIcon/>
                                            </IconButtonWithTooltip>

                                            <IconButtonWithTooltip
                                                title="Delete command from message"
                                                onClick={() => onDelete(command.id)}
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
    );
};

CommandList.propTypes = {
    setCommands: PropTypes.func.isRequired,
    commands: PropTypes.array.isRequired,
    editingId: PropTypes.string,
    recentlyEditedId: PropTypes.string,
    setEditingId: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    setCommandParameters: PropTypes.func.isRequired,
    commandParametersRef: PropTypes.object.isRequired
};


export default CommandList;
