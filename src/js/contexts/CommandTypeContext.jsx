import {createContext, useState} from 'react';
import PropTypes from 'prop-types';
import {commandTypes} from '../constants/index.js';


const CommandTypeContext = createContext({});

const CommandTypeProvider = ( {children} ) => {
    const [commandType, setCommandType] = useState(commandTypes.ANALOG);

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
