import {Box, Collapse, Link} from '@mui/material';
import createCommandDocLink from '../../../utils/createCommandDocLink.js';
import createCommandDirectionIcon from '../../../utils/createCommandDirectionIcon.js';

import HighlightedText from '../../../components/HighlightedText.js';

import {TExpandedLogs} from '../../../types.js';

import decimalToHex from './decimalToHex.js';


const createSubLogTitle = (logCommand: object, expandedLogs: TExpandedLogs) => (
    <>
        {createCommandDirectionIcon(logCommand.command.directionType)}
        <Box>
            <Box sx={{minWidth: 0}}>
                {
                    logCommand.command.id
                        ? (
                            <>
                                {'id: '}
                                <HighlightedText isMonospacedFont={true}>
                                    {decimalToHex(logCommand.command.id)}
                                </HighlightedText>
                                {'; '}
                            </>
                        )
                        : null
                }
                {'name: '}
                {
                    logCommand.command.id !== undefined
                        ? (
                            <Link
                                href={createCommandDocLink(logCommand.command)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={event => event.stopPropagation()}
                            >
                                {logCommand.command.name}
                            </Link>
                        )
                        : <HighlightedText>{logCommand.command.name}</HighlightedText>
                }
                {'; size: '}
                <HighlightedText>{logCommand.command.length}</HighlightedText>
            </Box>

            {
                logCommand.command.id && logCommand.command.hasParameters && (
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
                            in={!expandedLogs.includes(logCommand.id)}
                        >
                            {JSON.stringify(logCommand.command.parameters)}
                        </Collapse>
                    </Box>
                )
            }
        </Box>
    </>
);


export default createSubLogTitle;