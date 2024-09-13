import {accessLevels} from 'jooby-codec/mtx1/constants/index.js';
import {accessKey} from './index.js';


export default {
    source: 'ff fe',
    destination: 'ff ff',
    accessLevel: accessLevels.UNENCRYPTED,
    accessKey: accessKey.DEFAULT_HEX,
    messageId: 0,
    segmentationSessionId: 0
};
