import {expect, test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {commandTypes} from '../../../src/js/constants/index.js';


const expectedTexts = {
    titles: ['Parse messages', 'Create message', 'Logs'],
    descriptions: [
        'May be required for parsing and creating a message',
        '',
        'Batch processing supported, each dump on a new line',
        'Commands in the message must be of the same direction'
    ]
};


test('check visibility elements on the page', async ( {page, baseURL} ) => {
    const mainPage = new MainPage(page);

    await page.goto(baseURL);

    expect(await mainPage.getAllTitleTexts()).toEqual(expectedTexts.titles);
    expect(await mainPage.getAllDescriptionTexts()).toEqual(expectedTexts.descriptions);
    expect(await mainPage.getAllSelectOption(MainPage.codec, true)).toEqual(Object.values(commandTypes));

    await expect(mainPage.getParseButton()).toBeVisible();
    await expect(mainPage.getAddCommandButton()).toBeVisible();
    await expect(mainPage.redirectToGithub()).toBeVisible();
    await expect(mainPage.redirectToGithub()).toHaveAttribute('href', 'https://github.com/jooby-dev/jooby-gui');
    await expect(mainPage.getTime2000Converter()).toBeVisible();
});
