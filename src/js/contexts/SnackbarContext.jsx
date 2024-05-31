import {createContext, useContext, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Snackbar, Alert} from '@mui/material';
import {v4 as uuidv4} from 'uuid';

import {severityTypes} from '../constants/index.js';


const DEFAULT_SNACKBAR_DURATION = 3000;

const SnackbarContext = createContext(() => { });

const SnackbarProvider = ( {children} ) => {
    const [snackbar, setSnackbar] = useState(null);

    const showSnackbar = useCallback(
        ({
            message,
            duration = DEFAULT_SNACKBAR_DURATION,
            severity = severityTypes.SUCCESS
        }) => {
            setSnackbar({id: uuidv4(), message, duration, severity});
        },
        []
    );

    const closeSnackbar = useCallback(
        (event, reason) => {
            if ( reason === 'clickaway' ) {
                return;
            }

            setSnackbar(null);
        },
        []
    );

    return (
        <SnackbarContext.Provider value={showSnackbar}>
            {children}
            <Snackbar
                open={!!snackbar}
                key={snackbar?.id}
                autoHideDuration={snackbar?.duration}
                onClose={closeSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={closeSnackbar} severity={snackbar?.severity} variant="filled">{snackbar?.message}</Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

SnackbarProvider.propTypes = {
    children: PropTypes.node.isRequired
};

const useSnackbar = () => useContext(SnackbarContext);


export {SnackbarProvider, useSnackbar};
