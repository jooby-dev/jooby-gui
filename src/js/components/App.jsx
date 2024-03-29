import {useState} from 'react';
import {Box} from '@mui/material';

import LogsPanel from './LogsPanel/LogsPanel.jsx';
import CommandPanel from './CommandPanel.jsx';


const App = () => {
    const [logs, setLogs] = useState([]);

    return (
        <Box sx={{display: 'flex', flexGrow: 1, '& > *': {minWidth: 0}}}>
            <CommandPanel setLogs={setLogs}/>
            <LogsPanel logs={logs} setLogs={setLogs}/>
        </Box>
    );
};


export default App;
