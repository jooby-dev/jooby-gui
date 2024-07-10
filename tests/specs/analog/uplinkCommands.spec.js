import {test, expect} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import fixture from '../../fixtures/main.js';
import {uplinkCommands} from '../../fixtures/analog/commands.js';


const validateUplinkCommand = async ( page, format, command ) => {
    const buttons = await page.locator('text="json"').elementHandles();
    const subCommands = Object.values(command.commands);

    for ( let index = 0; index < subCommands.length; index++ ) {
        await buttons[index].click();

        format === fixture.parseMessages.format.hex
            ? await expect(page.getByText(subCommands[index].dump)).toBeVisible()
            : await expect(page.getByText(subCommands[index].dump)).toHaveCount(2);

        await expect(page.getByRole('link', {name: subCommands[index].name})).toBeVisible();
        await expect(page.getByText(command.hex.lrc)).toBeVisible();

        expect(JSON.parse(await page.getByLabel('json', {exact: true}).nth(index).innerText()))
            .toStrictEqual(subCommands[index].parameters);
    }
};

test.describe('analog uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump);
            await mainPage.expandLogs();
            await validateUplinkCommand(page, fixture.parseMessages.format.hex, command);
        });
    }
});

test.describe('analog uplink commands - parse base64 dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.format.base64).click();
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.base64);
            await mainPage.expandLogs();
            await validateUplinkCommand(page, fixture.parseMessages.format.base64, command);
        });
    }
});

test.describe('analog uplink commands - create messages', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = new MainPage(page);

            if ( command.hardwareType ) {
                await mainPage.selectHardwareType(command.hardwareType);
            }

            for ( const [, subCommand] of Object.entries(command.commands) ) {
                await mainPage.createMessage(subCommand, 'uplink');
            }

            await mainPage.buildMessage();
            await mainPage.expandLogs();

            await expect(page.getByText(mainPage.formatDump(command.hex.dump))).toBeVisible();
        });
    }
});
