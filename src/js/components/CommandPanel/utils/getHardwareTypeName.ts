export default (hardwareType: object | null): string | undefined => (
    hardwareType ? hardwareType.label : undefined
);
