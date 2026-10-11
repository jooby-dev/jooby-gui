import {expect, test} from '@playwright/test';
import {time} from 'jooby-codec/analog/utils/index.js';
import formatDeviceDate from '../../../src/js/components/Log/utils/formatDeviceDate.js';


test('format device-clock dates without a timezone suffix', () => {
    expect(formatDeviceDate(time.getDateFromTime2000(0))).toBe('2000.01.01 00:00:00');
    expect(formatDeviceDate(time.getDateFromTime2000(778068044))).toBe('2024.08.27 10:00:44');
    expect(formatDeviceDate(time.getDateFromTime2000(762602400))).toBe('2024.03.01 10:00:00');
});
