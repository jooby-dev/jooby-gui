import {useCallback} from 'react';
import {useSnackbar} from '../contexts/SnackbarContext.jsx';
import {SEVERITY_TYPE_ERROR} from '../constants.js';


const useCopyToClipboard = () => {
    const showSnackbar = useSnackbar();

    const copyToClipboard = useCallback(
        (data, snackbarConfig) => {
            navigator.clipboard
                .writeText(data)
                .then(() => {
                    if ( snackbarConfig ) {
                        showSnackbar(snackbarConfig);
                    }
                })
                .catch(() => {
                    showSnackbar({
                        message: 'Failed to copy data to clipboard',
                        severity: SEVERITY_TYPE_ERROR
                    });
                });
        },
        [showSnackbar]
    );

    return copyToClipboard;
};


export default useCopyToClipboard;
