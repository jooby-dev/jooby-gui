import {useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {CheckCircle as CheckCircleIcon, ContentCopy as ContentCopyIcon} from '@mui/icons-material';

import useCopyToClipboard from '../hooks/useCopyToClipboard.js';


const HexDisplay = ( {hex, ...props} ) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = useCopyToClipboard();

    const onCopy = event => {
        event.stopPropagation();

        if ( copied ) {
            return;
        }

        const preparedHex = hex.replace(/\s+/g, '').replace(/0x/gi, '');

        copyToClipboard(preparedHex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box
            onClick={onCopy}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                padding: '2px 4px',
                borderRadius: '4px',
                fontFamily: 'Roboto Mono, monospace',
                userSelect: 'none',
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                    color: 'primary.main'
                },
                ...props.sx
            }}
        >
            <span data-test="hex">{hex}</span>
            {copied
                ? <CheckCircleIcon sx={{ml: 1, color: 'success.main', fontSize: '1rem'}}/>
                : <ContentCopyIcon sx={{ml: 1, color: 'grey.600', fontSize: '1rem'}}/>
            }
        </Box>
    );
};

HexDisplay.propTypes = {
    hex: PropTypes.string.isRequired,
    sx: PropTypes.object
};

export default HexDisplay;
