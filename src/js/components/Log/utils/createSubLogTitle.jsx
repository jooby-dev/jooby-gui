import {Box, Collapse, Link} from '@mui/material';

import createCommandDocLink from '../../../utils/createCommandDocLink.js';
import createDirectionIcon from '../../../utils/createDirectionIcon.jsx';
import getHexFromNumber from '../../../utils/getHexFromNumber.js';
import removeQuotes from '../../../utils/removeQuotes.js';

import HighlightedText from '../../HighlightedText.jsx';
import HexViewer from '../../HexViewer.jsx';

import {unknownCommand} from '../../../constants/index.js';


const createSubLogTitle = ( logCommand, commandType ) => (
    <>
        {createDirectionIcon(logCommand.command.directionType)}
        <Box>
            <Box sx={{minWidth: 0}}>
                {
                    logCommand.command.id
                        ? (
                            <>
                                {'id: '}
                                <HexViewer hex={getHexFromNumber(logCommand.command.id)}/>
                                <HighlightedText isMonospacedFont={true}>({logCommand.command.id})</HighlightedText>
                                {'; '}
                            </>
                        )
                        : null
                }
                {'name: '}
                {
                    logCommand.command.name !== unknownCommand.NAME
                        ? (
                            <Link
                                href={createCommandDocLink(logCommand.command, commandType)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={event => event.stopPropagation()}
                            >
                                {logCommand.command.name}
                            </Link>
                        )
                        : <HighlightedText>{logCommand.command.name}</HighlightedText>
                }
                {
                    logCommand.command.length
                        ? (
                            <>
                                {'; size: '}
                                <HighlightedText>{logCommand.command.length}</HighlightedText>
                            </>
                        )
                        : null
                }
            </Box>

            {
                logCommand.command.parameters && logCommand.command.hasParameters && (
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
                            in={!logCommand.isExpanded}
                        >
                            {removeQuotes(JSON.stringify(logCommand.command.parameters))}
                        </Collapse>
                    </Box>
                )
            }
        </Box>
    </>
);


export default createSubLogTitle;
