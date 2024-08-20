import {create} from 'zustand';
import {framingFormats} from '../constants/index.js';


export const useCodecStore = create(
    set => ({
        framingFormat: framingFormats.HDLC,
        setFramingFormat: framingFormat => set({framingFormat})
    })
);
