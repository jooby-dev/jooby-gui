import {createContext, useState} from 'react';
import PropTypes from 'prop-types';
import {COMMAND_TYPE_ANALOG} from '../constants.js';


const CommandTypeContext = createContext({});

const CommandTypeProvider = ({children}) => {
    const [commandType, setCommandType] = useState(COMMAND_TYPE_ANALOG);

    return (
        <CommandTypeContext.Provider value={{commandType, setCommandType}}>
            {children}
        </CommandTypeContext.Provider>
    );
};

CommandTypeProvider.propTypes = {
    children: PropTypes.node.isRequired
};


export {CommandTypeProvider, CommandTypeContext};
