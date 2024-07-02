import {test, expect} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import fixture from '../../fixtures/main.js';
import {uplinkSimpleCommands} from '../../fixtures/analog/uplinkCommands.js';


const checkingParsedMessage = async ( page, format, command ) => {
    format === fixture.parseMessages.format.hex
        ? await page.getByLabel(fixture.parseMessages.dump.label, {exact: true}).fill(uplinkSimpleCommands[command].hex.dump)
        : await page.getByLabel(fixture.parseMessages.dump.label, {exact: true}).fill(uplinkSimpleCommands[command].base64);

    await page.getByTestId(fixture.parseMessages.parseButton).click();

    const logsTab = new MainPage(page);
    await page.getByLabel(fixture.logs.buttons.expandLogs).click();
    await page.waitForTimeout(2000);
    await page.getByRole('tab', {name: 'json'}).click();

    await expect(page.getByRole('link', {name: uplinkSimpleCommands[command].name})).toBeVisible();
    await expect(page.getByText(uplinkSimpleCommands[command].hex.lrc)).toBeVisible();

    format === fixture.parseMessages.format.hex
        ? await expect(page.getByText(uplinkSimpleCommands[command].hex.command)).toBeVisible()
        : await expect(page.getByText(uplinkSimpleCommands[command].hex.command)).toHaveCount(2);

    expect(logsTab.parseParameters(await page.getByLabel('json', {exact: true}).allInnerTexts()))
        .toStrictEqual(uplinkSimpleCommands[command].expectedParameters);
};


test.describe('simple analog uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const command in uplinkSimpleCommands ) {
        test(`check ${command}`, async ( {page} ) => {
            await checkingParsedMessage(page, fixture.parseMessages.format.hex, command);
        });
    }
});

test.describe('simple analog uplink commands - parse base64 dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.format.base64).click();
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const command in uplinkSimpleCommands ) {
        test(`check ${command}`, async ( {page} ) => {
            await checkingParsedMessage(page, fixture.parseMessages.format.base64, command);
        });
    }
});
