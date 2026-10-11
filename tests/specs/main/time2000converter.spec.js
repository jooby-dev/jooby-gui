import {expect, test} from '@playwright/test';
import {time} from 'jooby-codec/analog/utils/index.js';
import {MainPage} from '../../objects/MainPage.js';


test.describe('time2000 converter - positive cases', () => {
    let mainPage;

    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        mainPage = new MainPage(page);
        await mainPage.getTime2000Converter().click();
    });

    test('set date and check timestamps', async ( {page} ) => {
        // Device clock digits are read as UTC, so the expected value does not depend on the browser offset.
        const deviceDate = new Date(Date.UTC(2024, 0, 1, 1, 10, 59));
        const expectedTimestamp = Math.floor(deviceDate.getTime() / 1000);
        const expectedTime2000 = time.getTime2000FromDate(deviceDate);

        await mainPage.fillInputInTime2000Converter(
            mainPage.getDateInTime2000Converter(),
            '01/01/2024 01:10:59'
        );
        await expect(page.getByLabel('Timestamp', {exact: true})).toHaveValue(String(expectedTimestamp));
        await expect(page.getByLabel('Time2000', {exact: true})).toHaveValue(String(expectedTime2000));
        await expect(page.getByText('Devices keep time in UTC.', {exact: true})).toBeVisible();
    });

    test('set time2000 timestamp and check date', async () => {
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '0');
        await expect(mainPage.getDateInTime2000Converter()).toHaveValue('01/01/2000 00:00:00');
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '778068044');
        await expect(mainPage.getDateInTime2000Converter()).toHaveValue('27/08/2024 10:00:44');
    });

    test('set linux epoch timestamp and check date', async () => {
        await mainPage.fillInputInTime2000Converter(mainPage.getTimestampInput(), '1709287200');
        await expect(mainPage.getDateInTime2000Converter()).toHaveValue('01/03/2024 10:00:00');
        await expect(mainPage.getTime2000Input()).toHaveValue('762602400');
    });
});

for ( const month of [0, 6] ) {
    test(`initialize from current UTC time in month ${month + 1}`, async ( {page, baseURL} ) => {
        await page.clock.setFixedTime(new Date(Date.UTC(2024, month, 15, 12, 34, 56)));
        await page.goto(baseURL);

        const mainPage = new MainPage(page);
        const expectedTimestamp = Date.UTC(2024, month, 15, 12, 34, 56) / 1000;

        await mainPage.getTime2000Converter().click();
        await expect(mainPage.getTimestampInput()).toHaveValue(String(expectedTimestamp));
        await expect(mainPage.getTime2000Input()).toHaveValue(String(expectedTimestamp - 946684800));
    });
}


test.describe('time2000 converter - negative cases', () => {
    let mainPage;

    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        mainPage = new MainPage(page);
        await mainPage.getTime2000Converter().click();
    });

    test('set wrong date', async ({page}) => {
        await mainPage.fillInputInTime2000Converter(
            mainPage.getDateInTime2000Converter(),
            '01/01/1999 00:00:00'
        );
        await expect(page.getByText('Date must be between 2000-01-01 and 2099-12-31')).toBeVisible();
        await expect(mainPage.getTime2000Input()).toHaveValue('');
        await expect(mainPage.getTimestampInput()).toHaveValue('');
        await expect(page.getByRole('button', {name: 'Copy time2000', exact: true})).toBeDisabled();
        await expect(page.getByRole('button', {name: 'Copy timestamp', exact: true})).toBeDisabled();
        await expect(page.getByRole('button', {name: 'Copy ISO date', exact: true})).toBeDisabled();
    });

    test('reject dates after the supported range and restore valid conversions', async ( {page} ) => {
        await mainPage.fillInputInTime2000Converter(mainPage.getDateInTime2000Converter(), '01/01/2100 00:00:00');
        await expect(mainPage.getTime2000Input()).toHaveValue('');
        await expect(mainPage.getTimestampInput()).toHaveValue('');
        await expect(page.getByRole('button', {name: 'Copy time2000', exact: true})).toBeDisabled();
        await expect(page.getByRole('button', {name: 'Copy timestamp', exact: true})).toBeDisabled();
        await expect(page.getByRole('button', {name: 'Copy ISO date', exact: true})).toBeDisabled();
        await mainPage.fillInputInTime2000Converter(mainPage.getDateInTime2000Converter(), '31/12/2099 23:59:59');
        await expect(mainPage.getTimestampInput()).toHaveValue('4102444799');
        await expect(mainPage.getTime2000Input()).toHaveValue('3155759999');
        await expect(page.getByRole('button', {name: 'Copy time2000', exact: true})).toBeEnabled();
        await expect(page.getByRole('button', {name: 'Copy timestamp', exact: true})).toBeEnabled();
        await expect(page.getByRole('button', {name: 'Copy ISO date', exact: true})).toBeEnabled();
    });

    test('reject numeric inputs outside the supported date range', async ( {page} ) => {
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '-1');
        await expect(mainPage.getTimestampInput()).toHaveValue('');
        await expect(page.getByRole('button', {name: 'Copy time2000', exact: true})).toBeDisabled();
        await mainPage.fillInputInTime2000Converter(mainPage.getTimestampInput(), '4102444800');
        await expect(mainPage.getTime2000Input()).toHaveValue('');
        await expect(page.getByRole('button', {name: 'Copy timestamp', exact: true})).toBeDisabled();
        await expect(page.getByRole('button', {name: 'Copy ISO date', exact: true})).toBeDisabled();
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '0');
        await expect(mainPage.getTimestampInput()).toHaveValue('946684800');
        await expect(page.getByRole('button', {name: 'Copy time2000', exact: true})).toBeEnabled();
        await expect(page.getByRole('button', {name: 'Copy timestamp', exact: true})).toBeEnabled();
    });

    test('clear date without crashing and restore a valid date', async ( {page} ) => {
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '778068044');
        await expect(mainPage.getTimestampInput()).toHaveValue('1724752844');
        await mainPage.getDateInTime2000Converter().clear();
        await expect(mainPage.getTime2000Input()).toHaveValue('');
        await expect(mainPage.getTimestampInput()).toHaveValue('');
        await expect(page.getByRole('button', {name: 'Copy ISO date', exact: true})).toBeDisabled();
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '0');
        await expect(mainPage.getDateInTime2000Converter()).toHaveValue('01/01/2000 00:00:00');
        await expect(mainPage.getTimestampInput()).toHaveValue('946684800');
        await expect(page.getByRole('button', {name: 'Copy ISO date', exact: true})).toBeEnabled();
    });

    test('clear date resets numeric input errors', async ( {page} ) => {
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '-');
        await mainPage.fillInputInTime2000Converter(mainPage.getTimestampInput(), '-');
        await expect(page.getByText('Invalid time2000', {exact: true})).toBeVisible();
        await expect(page.getByText('Invalid timestamp', {exact: true})).toBeVisible();
        await mainPage.getDateInTime2000Converter().clear();
        await expect(mainPage.getTime2000Input()).toHaveValue('');
        await expect(mainPage.getTimestampInput()).toHaveValue('');
        await expect(page.getByText('Invalid time2000', {exact: true})).toHaveCount(0);
        await expect(page.getByText('Invalid timestamp', {exact: true})).toHaveCount(0);
    });

    test('set empty time2000 timestamp', async ({page}) => {
        await mainPage.getTime2000Input().clear();
        await expect(page.getByText('Invalid time2000')).toBeVisible();
    });

    test('set empty linux epoch timestamp', async ({page}) => {
        await mainPage.getTimestampInput().clear();
        await expect(page.getByText('Invalid timestamp')).toBeVisible();
    });
});
