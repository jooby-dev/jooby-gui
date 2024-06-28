import {test, expect} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import fixture from '../../fixtures/main.js';
import {uplinkHexSimpleCommands} from '../../fixtures/analog/uplinkHexCommands.js';


test.describe('parse hex dumps - simple analog uplink commands', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const command in uplinkHexSimpleCommands ) {
        test(`check ${command}`, async ( {page} ) => {
            await page.getByLabel(fixture.parseMessages.dump.label, {exact: true}).fill(uplinkHexSimpleCommands[command].dump);
            await page.getByTestId(fixture.parseMessages.parseButton).click();

            const logsTab = new MainPage(page);
            await page.getByLabel('Expand logs').click();
            await page.waitForTimeout(2000);
            await page.getByRole('tab', {name: 'json'}).click();

            await expect(page.getByRole('link', {name: uplinkHexSimpleCommands[command].name})).toBeVisible();
            await expect(page.getByText(uplinkHexSimpleCommands[command].lrc)).toBeVisible();
            await expect(page.getByText(uplinkHexSimpleCommands[command].command)).toBeVisible();
            expect(logsTab.parseParameters(await page.getByLabel('json', {exact: true}).allInnerTexts())).toStrictEqual(uplinkHexSimpleCommands[command].expectedParameters);
        });
    }
});
