import {ReactNode} from 'react';
import {Box} from '@mui/material';


const HighlightedText = ({
    children,
    color = 'inherit',
    fontSize = 'inherit',
    fontWeight = 'fontWeightMedium',
    isMonospacedFont = false
}: {
    children: ReactNode;
    color?: string;
    fontSize?: string;
    fontWeight?: string
    isMonospacedFont?: boolean;
}) => (
    <Box
        component="span"
        sx={{
            color,
            fontSize,
            fontWeight,
            fontFamily: isMonospacedFont ? 'Roboto Mono, monospace' : 'inherit'
        }}
    >
        {children}
    </Box>
);


export default HighlightedText;
