const COMMENT_IDENTIFIER = '//';

/**
 * Removes comment lines from a given string.
 *
 * This function takes a string and removes all lines that start with '//',
 * ignoring leading and trailing whitespace. It assumes that such lines are
 * comments and can be safely removed.
 *
 * @param {string} input - The input string to remove comments from.
 *
 * @returns {string} The input string with comment lines removed.
 */
export default (input: string): string => {
    const lines = input.split('\n');
    const filteredLines = lines.filter(line => !line.trim().startsWith(COMMENT_IDENTIFIER));

    return filteredLines.join('\n');
};
