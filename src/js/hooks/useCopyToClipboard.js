import {useCallback} from 'react';
import {useSnackbar} from '../contexts/SnackbarContext.jsx';
import {severityTypes} from '../constants/index.js';


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
                        severity: severityTypes.ERROR
                    });
                });
        },
        [showSnackbar]
    );

    return copyToClipboard;
};


export default useCopyToClipboard;
