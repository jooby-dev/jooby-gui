export default json => {
    try {
        JSON.parse(json);

        return true;
    } catch {
        return false;
    }
};
