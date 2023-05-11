export default (decimal: number, prefix = '0x') => (
    `${prefix}${decimal.toString(16).toUpperCase().padStart(2, '0')}`
);
