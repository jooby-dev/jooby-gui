import {ReactNode, createContext, useContext, useState, useRef, useEffect} from 'react';
import {Snackbar, Alert, SnackbarCloseReason} from '@mui/material';

import {ShowSnackbarParams, Severity} from '../types';
import {SEVERITY_TYPE_SUCCESS} from '../constants';


const DEFAULT_SNACKBAR_DURATION = 3000;


interface SnackbarContextData {
    showSnackbar: (params: ShowSnackbarParams) => void;
}

interface SnackbarProviderProps {
    children: ReactNode;
}


const SnackbarContext = createContext<SnackbarContextData>({} as SnackbarContextData);

const SnackbarProvider = ({children}: SnackbarProviderProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<Severity>(SEVERITY_TYPE_SUCCESS);
    const [snackbarDuration, setSnackbarDuration] = useState(DEFAULT_SNACKBAR_DURATION);
    const snackbarQueue = useRef<Array<{message: string; duration: number, severity: Severity}>>([]);
    const timeoutId = useRef<number | null>(null);

    const processQueue = () => {
        if (snackbarQueue.current.length > 0) {
            const nextSnackbar = snackbarQueue.current.shift();
            if (nextSnackbar) {
                setSnackbarMessage(nextSnackbar.message);
                setSnackbarDuration(nextSnackbar.duration);
                setSnackbarSeverity(nextSnackbar.severity);
                setSnackbarOpen(true);
            }
        }
    };

    const showSnackbar = ({message, duration = DEFAULT_SNACKBAR_DURATION, severity = SEVERITY_TYPE_SUCCESS}: ShowSnackbarParams) => {
        snackbarQueue.current.push({message, duration, severity});

        if (!snackbarOpen && !timeoutId.current) {
            processQueue();
        }
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);

        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
            processQueue();
            timeoutId.current = null;
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, []);

    return (
        <SnackbarContext.Provider value={{showSnackbar}}>
            {children}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={snackbarDuration}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleClose} severity={snackbarSeverity} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

const useSnackbar = () => useContext(SnackbarContext);


export {SnackbarProvider, useSnackbar};
