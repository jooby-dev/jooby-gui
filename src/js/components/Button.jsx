import PropTypes from 'prop-types';
import {Button as MuiButton} from '@mui/material';


const Button = ( {children, ...rest} ) => (
    <MuiButton variant="contained" color="primary" disableElevation {...rest}>
        {children}
    </MuiButton>
);

Button.propTypes = {
    children: PropTypes.node
};


export default Button;
