export const getHardwareType = (hardwareType: object | null): number | undefined => (
    hardwareType ? hardwareType.value : undefined
);
