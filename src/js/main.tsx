import React from 'react';
import {createRoot} from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {SnackbarProvider} from './contexts/SnackbarContext.js';
import App from './components/App.js';
import '../sass/main.scss';

declare module '@mui/material/styles' {
    interface TypeBackground {
        filled: string;
        filledHover: string;
    }
}


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


createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider>
                <App/>
            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>
);
