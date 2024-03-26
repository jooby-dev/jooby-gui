// todo: better to extend TextArea and implement own "submit" or another event
export default onSubmit => (
    event => {
        if (
            event.key === 'Enter'
            && event.ctrlKey
            && event.target instanceof HTMLTextAreaElement
        ) {
            onSubmit();
        }
    }
);
