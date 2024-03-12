import {Box, Collapse, Link} from '@mui/material';
import {utils} from '@jooby-dev/jooby-codec';

import createCommandDocLink from '../../../utils/createCommandDocLink.js';
import createCommandDirectionIcon from '../../../utils/createCommandDirectionIcon.jsx';

import HighlightedText from '../../HighlightedText.jsx';


const createSubLogTitle = ( logCommand, commandType ) => (
    <>
        {createCommandDirectionIcon(logCommand.command, commandType)}
        <Box>
            <Box sx={{minWidth: 0}}>
                {
                    logCommand.command.id
                        ? (
                            <>
                                {'id: '}
                                <HighlightedText isMonospacedFont={true}>
                                    {utils.getHexFromNumber(logCommand.command.id, {prefix: '0x'})}
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
                            in={!logCommand.isExpanded}
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
