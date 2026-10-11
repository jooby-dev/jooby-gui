import PropTypes from 'prop-types';
import {Tooltip, IconButton} from '@mui/material';


const IconButtonWithTooltip = ({
    title,
    disabled = false,
    size = 'small',
    ...otherProps
}) => {
    const button = (
        <IconButton
            aria-label={typeof title === 'string' ? title : undefined}
            size={size}
            disabled={disabled}
            {...otherProps}
        />
    );

    if ( disabled ) {
        return button;
    }

    return <Tooltip title={title}>{button}</Tooltip>;
};

IconButtonWithTooltip.propTypes = {
    title: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large'])
};


export default IconButtonWithTooltip;
