export const createCtrlEnterSubmitHandler = (onSubmit: () => void) => (
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
