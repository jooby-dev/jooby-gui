import {expect, test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';


test.describe('time2000 converter - positive cases', () => {
    let mainPage;

    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        mainPage = new MainPage(page);
        await mainPage.getTime2000Converter().click();
    });

    test('set date and check timestamps', async ( {page} ) => {
        await mainPage.fillInputInTime2000Converter(
            mainPage.getDateInTime2000Converter(),
            '01/01/2024 01:10:59'
        );
        await expect(page.getByLabel('Time2000', {exact: true})).toHaveValue('757386659');
        await expect(page.getByLabel('Timestamp', {exact: true})).toHaveValue('1704071459');
    });

    test('set time2000 timestamp and check date', async () => {
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '0');
        expect(await mainPage.getDateInTime2000Converter().inputValue()).toContain('01/01/2000');
        await mainPage.fillInputInTime2000Converter(mainPage.getTime2000Input(), '778068044');
        expect(await mainPage.getDateInTime2000Converter().inputValue()).toContain('27/08/2024');
    });

    test('set linux epoch timestamp and check date', async () => {
        await mainPage.fillInputInTime2000Converter(mainPage.getTimestampInput(), '1709287200');
        expect(await mainPage.getDateInTime2000Converter().inputValue()).toContain('01/03/2024');
    });
});

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
