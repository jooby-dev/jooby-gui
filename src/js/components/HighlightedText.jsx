import PropTypes from 'prop-types';
import {Box} from '@mui/material';


const HighlightedText = ({
    children,
    color = 'inherit',
    fontSize = 'inherit',
    fontWeight = 'fontWeightMedium',
    isMonospacedFont = false
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

HighlightedText.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    fontSize: PropTypes.string,
    fontWeight: PropTypes.string,
    isMonospacedFont: PropTypes.bool
};


export default HighlightedText;
