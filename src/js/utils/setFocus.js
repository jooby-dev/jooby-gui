export default ref => {
    setTimeout(
        () => {
            if ( ref.current ) {
                ref.current.focus();
            }
        },
        0
    );
};
