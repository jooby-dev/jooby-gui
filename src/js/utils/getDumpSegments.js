import {segmentTypes} from '../constants/index.js';


// entire line is a valid hex string
const fullHexPattern = /^(?:[0-9a-fA-F]{2})(?:[\t ]*[0-9a-fA-F]{2})*$/;

// Embedded hex must be whitespace-bounded on both sides (or at line start/end),
// so hex glued to other characters (e.g. "12:02", "(1f05)") is left as text.
const embeddedHexPattern = /(^|[\t ])((?:[0-9a-fA-F]{2})(?:[\t ]+[0-9a-fA-F]{2})*)(?=[\t ]|$)/g;

const normalizeHex = value => value.replace(/[\t ]+/g, '').toLowerCase();

// splits a single line into ordered hex/text segments
const getLineSegments = ( line, minBytes ) => {
    if ( fullHexPattern.test(line) ) {
        return [{type: segmentTypes.HEX, value: line}];
    }

    const segments = [];
    let lastIndex = 0;

    const pushText = raw => {
        const value = raw.trim();

        if ( value ) {
            segments.push({type: segmentTypes.TEXT, value});
        }
    };

    for ( const match of line.matchAll(embeddedHexPattern) ) {
        const hex = match[2];

        if ( normalizeHex(hex).length / 2 < minBytes ) {
            continue;
        }

        const hexStart = match.index + match[1].length;

        pushText(line.slice(lastIndex, hexStart));
        segments.push({type: segmentTypes.HEX, value: hex});
        lastIndex = hexStart + hex.length;
    }

    pushText(line.slice(lastIndex));

    return segments;
};

/**
 * Splits text into an ordered list of hex and text segments.
 *
 * A fully-hex line becomes a hex segment; otherwise whitespace-bounded hex runs
 * of at least `minBytes` are pulled out and the rest is kept as text (consecutive
 * text is merged). Hex segments keep their original spacing/case for display;
 * text segments are trimmed.
 *
 * @param {string} text - the input string to split
 * @param {object} [options]
 * @param {number} [options.minBytes=3] - minimum byte length for an embedded hex run
 *
 * @returns {Array<{type: segmentTypes, value: string}>} ordered segments
 */
export default ( text, {minBytes = 3} = {} ) => {
    const segments = [];
    let textBuffer = [];

    const flushTextBuffer = () => {
        if ( textBuffer.length ) {
            segments.push({type: segmentTypes.TEXT, value: textBuffer.join('\n')});
            textBuffer = [];
        }
    };

    for ( const rawLine of text.split('\n') ) {
        const line = rawLine.trim();

        if ( line === '' ) {
            continue;
        }

        for ( const segment of getLineSegments(line, minBytes) ) {
            if ( segment.type === segmentTypes.TEXT ) {
                textBuffer.push(segment.value);
            } else {
                flushTextBuffer();
                segments.push(segment);
            }
        }
    }

    flushTextBuffer();

    return segments;
};
