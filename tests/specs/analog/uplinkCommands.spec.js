import {test, expect} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import fixture from '../../fixtures/main.js';
import {uplinkComplexCommands, uplinkSimpleCommands} from '../../fixtures/analog/uplinkCommands.js';


const validateUplinkCommand = async ( page, format, command, isComplex = false ) => {
    if ( isComplex ) {
        await page.getByLabel(fixture.hardwareType.label).click();
        await page.getByText(command.hardwareType).click();
    }

    /* eslint-disable-next-line no-nested-ternary */
    const dumpData = format === fixture.parseMessages.format.hex
        ? isComplex ? command.hex.dump : command.hex.dump
        : isComplex ? command.base64 : command.base64;

    await page.getByLabel(fixture.parseMessages.dump.label, {exact: true}).fill(dumpData);
    await page.getByTestId(fixture.parseMessages.parseButton).click();
    await page.getByLabel(fixture.logs.buttons.expandLogs).click();
    await page.waitForTimeout(2000);

    if ( isComplex ) {
        const buttons = await page.locator('text="json"').elementHandles();

        const subCommands = Object.values(command.commands);

        for ( let index = 0; index < subCommands.length; index++ ) {
            await buttons[index].click();

            format === fixture.parseMessages.format.hex
                ? await expect(page.getByText(subCommands[index].dump)).toBeVisible()
                : await expect(page.getByText(subCommands[index].dump)).toHaveCount(2);

            expect(JSON.parse(await page.getByLabel('json', {exact: true}).nth(index).innerText()))
                .toStrictEqual(subCommands[index].parameters);
        }
    } else {
        await page.getByRole('tab', {name: 'json'}).click();
        await expect(page.getByRole('link', {name: command.name})).toBeVisible();
        await expect(page.getByText(command.hex.lrc)).toBeVisible();

        format === fixture.parseMessages.format.hex
            ? await expect(page.getByText(command.hex.command)).toBeVisible()
            : await expect(page.getByText(command.hex.command)).toHaveCount(2);

        expect(new MainPage(page).parseParameters(await page.getByLabel('json', {exact: true}).allInnerTexts()))
            .toStrictEqual(command.parameters);
    }
};


test.describe('simple analog uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkSimpleCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            await validateUplinkCommand(page, fixture.parseMessages.format.hex, command);
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

    for ( const [commandKey, command] of Object.entries(uplinkSimpleCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            await validateUplinkCommand(page, fixture.parseMessages.format.base64, command);
        });
    }
});

test.describe('complex analog uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.format.hex).click();
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkComplexCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            await validateUplinkCommand(page, fixture.parseMessages.format.hex, command, true);
        });
    }
});

test.describe('complex analog uplink commands - parse base64 dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.format.base64).click();
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkComplexCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            await validateUplinkCommand(page, fixture.parseMessages.format.base64, command, true);
        });
    }
});
