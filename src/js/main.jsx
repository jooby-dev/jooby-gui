import React from 'react';
import {createRoot} from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';

import {SnackbarProvider} from './contexts/SnackbarContext.jsx';
import {CommandTypeProvider} from './contexts/CommandTypeContext.jsx';
import {CodecBuildPrefillDataProvider} from './contexts/CodecBuildPrefillDataContext.jsx';
import App from './components/App.jsx';
import '../sass/main.scss';


const theme = createTheme({
    palette: {
        warning: {
            light: '#fef0e4',
            main: '#ed6c02'
        },
        success: {
            light: '#e6f5e7',
            main: '#2e7d32'
        },
        error: {
            light: '#faeaea',
            main: '#d32f2f'
        },
        background: {
            filled: 'rgba(0, 0, 0, 0.06)',
            filledHover: 'rgba(0, 0, 0, 0.12)'
        }
    }
});


createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <SnackbarProvider>
                    <CommandTypeProvider>
                        <CodecBuildPrefillDataProvider>
                            <App/>
                        </CodecBuildPrefillDataProvider>
                    </CommandTypeProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </LocalizationProvider>
    </React.StrictMode>
);
