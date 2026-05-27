import PropTypes from 'prop-types';
import {styled} from '@mui/material/styles';

import IconButtonWithTooltip from './IconButtonWithTooltip.jsx';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});


const FileUploadButton = ( {title, accept, onSelect, children, multiple = false} ) => {
    const onChange = event => {
        const files = [...event.target.files];

        if ( files.length ) {
            onSelect(files);
        }

        event.target.value = null;
    };

    return (
        <IconButtonWithTooltip title={title} component="label">
            {children}
            <VisuallyHiddenInput
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={onChange}
            />
        </IconButtonWithTooltip>
    );
};

FileUploadButton.propTypes = {
    title: PropTypes.node.isRequired,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    children: PropTypes.node
};


export default FileUploadButton;
