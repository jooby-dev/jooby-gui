import {test, expect} from '@playwright/test';
import {MainPage} from '../objects/MainPage.js';
import fixture from '../fixtures/main.js';


test.describe('functional test', () => {
    test('check visibility of elements', async ( {page, baseURL} ) => {
        await page.goto(baseURL);

        const $titles = await page.locator('h5').allInnerTexts();
        const $descriptions = await page.locator('p').allInnerTexts();
        const $codecOptions = await new MainPage(page).getAllSelectOption(fixture.codecType.label, true);
        const $hardwareOptions = await new MainPage(page).getAllSelectOption(fixture.hardwareType.label);
        const $commandsOptions = await new MainPage(page).getAllSelectOption(fixture.createMessages.select.label);
        const $parseButton = page.getByTestId(fixture.parseMessages.parseButton);
        const $addCommandButton = page.getByTestId(fixture.createMessages.addCommandButton);

        expect($titles).toEqual([fixture.parseMessages.title.text, fixture.createMessages.title.text, fixture.logs.title.text]);
        expect($descriptions).toEqual([
            fixture.hardwareType.description.text,
            '',
            fixture.parseMessages.description.text,
            fixture.createMessages.description.text
        ]);

        expect($codecOptions).toEqual(fixture.codecType.options);
        expect($commandsOptions.length).toEqual(fixture.hardwareType.analog.commands.length);

        $commandsOptions.forEach(command => expect(fixture.hardwareType.analog.commands).toContain(command));

        await expect($parseButton).toBeVisible();
        await expect($addCommandButton).toBeVisible();
        await expect(page.getByRole('link', {name: 'GitHub'})).toBeVisible();

        fixture.hardwareType.analog.options.forEach((option, index) => {
            expect($hardwareOptions[index]).toEqual(option.label);
        });
    });
});
