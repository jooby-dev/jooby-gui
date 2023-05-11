import {ReactNode} from 'react';
import {Box} from '@mui/material';


interface IHighlightedTextProps {
    children: ReactNode;
    color?: string;
    fontSize?: string;
    fontWeight?: string
    isMonospacedFont?: boolean;
}


const HighlightedText = ({
    children,
    color = 'inherit',
    fontSize = 'inherit',
    fontWeight = 'fontWeightMedium',
    isMonospacedFont = false
}: IHighlightedTextProps) => (
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
