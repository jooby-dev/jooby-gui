import {useState} from 'react';
import {Box} from '@mui/material';

import LogsPanel from './LogsPanel/LogsPanel.js';
import CommandPanel from './CommandPanel/CommandPanel.js';

import {ILogItem} from '../types';


const App = () => {
    const [logs, setLogs] = useState<Array<ILogItem>>([]);

    return (
        <Box sx={{display: 'flex', flexGrow: 1, '& > *': {minWidth: 0}}}>
            <CommandPanel setLogs={setLogs}/>
            <LogsPanel logs={logs} setLogs={setLogs}/>
        </Box>
    );
};


export default App;
