export default number => {
    const hex = number.toString(16);

    return `0x${hex.length % 2 === 0 ? hex : `0${hex}`}`;
};
