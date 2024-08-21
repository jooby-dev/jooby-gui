import {test, expect} from '@playwright/test';
import {MainPage} from '../objects/MainPage.js';
import {commandTypes} from '../../src/js/constants/index.js';
import {commandTypeConfigMap} from '../../src/js/joobyCodec.js';


const expectedTexts = {
    titles: ['Parse messages', 'Create message', 'Logs'],
    descriptions: [
        'May be required for parsing and creating a message',
        '',
        'Batch processing supported, each dump on a new line',
        'Commands in the message must be of the same direction'
    ],
    analog: {
        options: commandTypeConfigMap.analog.hardwareTypeList,
        commands: commandTypeConfigMap.analog.preparedCommandList.map(command => command.value.name.toString())
    }

};


test.describe('functional test', () => {
    test('check visibility of elements', async ( {page, baseURL} ) => {
        await page.goto(baseURL);

        const mainPage = new MainPage(page);
        const $codecOptions = await mainPage.getAllSelectOption(MainPage.codec, true);
        const $hardwareOptions = await mainPage.getAllSelectOption(MainPage.hardwareType);
        const $commandsOptions = await mainPage.getAllSelectOption(MainPage.command);

        expect(await mainPage.getAllTitleTexts()).toEqual(expectedTexts.titles);
        expect(await mainPage.getAllDescriptionTexts()).toEqual(expectedTexts.descriptions);
        expect($codecOptions).toEqual(Object.values(commandTypes));
        expect($commandsOptions.length).toEqual(expectedTexts.analog.commands.length);

        await expect(await mainPage.getParseButtonAndClick(false)).toBeVisible();
        await expect(await mainPage.getAddCommandButtonAndClick(false)).toBeVisible();
        await expect(mainPage.redirectToGithub()).toBeVisible();

        $commandsOptions.forEach(command => expect(expectedTexts.analog.commands).toContain(command));

        expectedTexts.analog.options.forEach((option, index) => {
            expect($hardwareOptions[index]).toEqual(option.label);
        });
    });
});
