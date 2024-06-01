import * as joobyCodec from 'jooby-codec';


export const LENGTH_BYTES = 16;
export const DEFAULT_HEX = joobyCodec.utils.getHexFromBytes(
    [...Array(LENGTH_BYTES).keys()],
    {separator: ' '}
);
