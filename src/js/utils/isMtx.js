import {commandTypes, framingFormats} from '../constants/index.js';


export default ( commandType, framingFormat ) => (
    (commandType === commandTypes.MTX1 || commandType === commandTypes.MTX3)
    && framingFormat === framingFormats.HDLC
);
