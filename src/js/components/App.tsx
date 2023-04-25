import {useState} from 'react';
import {Box} from '@mui/material';

import LogsPanel from './LogsPanel';
import CommandPanel from './CommandPanel';

import {Log} from '../types';


const App = () => {
    const [logs, setLogs] = useState<Array<Log>>([]);

    return (
        <Box sx={{display: 'flex', flexGrow: 1, '& > *': {minWidth: 0}}}>
            <CommandPanel setLogs={setLogs} />
            <LogsPanel logs={logs} setLogs={setLogs} />
        </Box>
    );
};


export default App;
