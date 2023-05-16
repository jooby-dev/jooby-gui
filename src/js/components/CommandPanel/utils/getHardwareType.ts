// todo: implement storage and change of hardware type using a separate state
export default (hardwareType: object | null): number | undefined => (
    hardwareType ? hardwareType.value : undefined
);
