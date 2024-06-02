import {Fragment} from 'react';
import * as joobyCodec from 'jooby-codec';
import {Box, Collapse, Tooltip} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';

import createDirectionIcon from '../../../utils/createDirectionIcon.jsx';
import removeQuotes from '../../../utils/removeQuotes.js';

import HighlightedText from '../../HighlightedText.jsx';

import {logTypes} from '../../../constants/index.js';


const renderHardwareType = ( hardwareType, commandType ) => {
    if ( !hardwareType ) {
        return null;
    }

    return (
        <>
            {'hardware type: '}
            <Tooltip title={`ID: ${joobyCodec[commandType].constants.hardwareTypes[hardwareType]}`}>
                <Box component="span">
                    <HighlightedText fontWeight="normal">{hardwareType}</HighlightedText>
                </Box>
            </Tooltip>
        </>
    );
};

const createLogTitle = log => {
    switch ( log.type ) {
        case logTypes.MESSAGE:
        case logTypes.FRAME: {
            const hardwareTypeContent = renderHardwareType(log.hardwareType, log.commandType);

            return (
                <>
                    {createDirectionIcon(log.data.commands[0].command.directionType)}
                    <Box>
                        <Box sx={{minWidth: 0}}>
                            <HighlightedText>{log.commandType}</HighlightedText>
                            {' (commands: '}
                            <HighlightedText fontWeight="normal">{log.data.commands.length}</HighlightedText>
                            {hardwareTypeContent
                                ? (
                                    <>
                                        {'; '}
                                        {hardwareTypeContent}
                                    </>
                                )
                                : ''
                            }
                            {')'}
                        </Box>

                        <Box sx={{
                            fontWeight: 'fontWeightRegular',
                            fontSize: '0.75rem',
                            color: 'grey.500',
                            fontFamily: 'Roboto Mono, monospace',
                            minWidth: 0
                        }}>
                            <Collapse
                                sx={{
                                    '& .MuiCollapse-wrapperInner': {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }}
                                in={!log.isExpanded}
                            >
                                {log.data.commands.map((commandData, index) => (
                                    <Fragment key={index}>
                                        <Box component="span" sx={{color: 'grey.700'}}>{commandData.command.name}</Box>
                                        {
                                            commandData.command.id && commandData.command.hasParameters
                                                ? `: ${removeQuotes(JSON.stringify(commandData.command.parameters))}`
                                                : ''
                                        }
                                        {'; '}
                                    </Fragment>
                                ))}
                            </Collapse>
                        </Box>
                    </Box>
                </>
            );
        }

        case logTypes.ERROR:
            return (
                <>
                    <CloseIcon color="error" sx={{mr: 2}}/>
                    <Box>
                        <Box sx={{minWidth: 0}}>
                            <HighlightedText>{log.commandType}</HighlightedText>
                        </Box>
                        <Box sx={{
                            fontWeight: 'fontWeightRegular',
                            fontSize: '0.75rem',
                            color: 'grey.500',
                            fontFamily: 'Roboto Mono, monospace',
                            minWidth: 0
                        }}>
                            <Collapse
                                sx={{
                                    '& .MuiCollapse-wrapperInner': {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }}
                                in={!log.isExpanded}
                            >
                                <Box component="span" sx={{color: 'grey.700'}}>error: </Box>
                                {log.error}
                            </Collapse>
                        </Box>
                    </Box>
                </>
            );

        default:
            throw new Error(`Unknown log type: ${log.type}`);
    }
};


export default createLogTitle;
