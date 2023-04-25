export const getHardwareTypeName = (hardwareType: object | null): string | undefined => (
    hardwareType ? hardwareType.label : undefined
);
