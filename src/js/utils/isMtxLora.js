import {commandTypes, framingFormats} from '../constants/index.js';


export default ( commandType, framingFormat ) => commandType === commandTypes.MTX && framingFormat === framingFormats.NONE;
