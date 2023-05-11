// todo: better to extend TextArea and implement own "submit" or another event
export default (onSubmit: () => void) => (
    (event: React.KeyboardEvent) => {
        if (
            event.key === 'Enter'
            && event.ctrlKey
            && event.target instanceof HTMLTextAreaElement
        ) {
            onSubmit();
        }
    }
);
