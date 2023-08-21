import {ReactNode, createContext, useContext, useState, useCallback} from 'react';
import {Snackbar, Alert, SnackbarCloseReason} from '@mui/material';
import {v4 as uuidv4} from 'uuid';

import {IShowSnackbarParams, TSeverity} from '../types.js';
import {SEVERITY_TYPE_SUCCESS} from '../constants.js';


const DEFAULT_SNACKBAR_DURATION = 3000;


interface ISnackbarProviderProps {
    children: ReactNode;
}

interface ISnackbar {
    id: string;
    message: string;
    duration: number;
    severity: TSeverity;
}

type TSnackbarContext = (params: IShowSnackbarParams) => void;

const SnackbarContext = createContext<TSnackbarContext>(() => {});

const SnackbarProvider = ( {children}: ISnackbarProviderProps ) => {
    const [snackbar, setSnackbar] = useState<ISnackbar | null>(null);

    const showSnackbar = useCallback(
        ({message, duration = DEFAULT_SNACKBAR_DURATION, severity = SEVERITY_TYPE_SUCCESS}: IShowSnackbarParams) => {
            setSnackbar({id: uuidv4(), message, duration, severity});
        },
        []
    );

    const closeSnackbar = useCallback(
        (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
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
                <Alert onClose={closeSnackbar} severity={snackbar?.severity} variant="filled">
                    {snackbar?.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

const useSnackbar = () => useContext(SnackbarContext);


export {SnackbarProvider, useSnackbar};
