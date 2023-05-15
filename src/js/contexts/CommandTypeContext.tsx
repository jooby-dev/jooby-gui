import {createContext, useState, ReactNode} from 'react';
import {TCommandType} from '../types.js';
import {COMMAND_TYPE_ANALOG} from '../constants.js';


interface ICommandTypeContext {
    commandType: TCommandType;
    setCommandType: (value: TCommandType) => void;
}

interface ICommandTypeProviderProps {
    children: ReactNode;
}

const CommandTypeContext = createContext<ICommandTypeContext>({} as ICommandTypeContext);


const CommandTypeProvider = ({children}: ICommandTypeProviderProps) => {
    const [commandType, setCommandType] = useState<TCommandType>(COMMAND_TYPE_ANALOG);

    return (
        <CommandTypeContext.Provider value={{commandType, setCommandType}}>
            {children}
        </CommandTypeContext.Provider>
    );
};


export {CommandTypeProvider, CommandTypeContext};
