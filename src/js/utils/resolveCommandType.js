import {commandTypes} from '../constants/index.js';


export default commandType => (commandType === commandTypes.MTX_LORA ? commandTypes.MTX : commandType);
