import {test, expect} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {downlinkCommands} from '../../fixtures/analog/commands.js';


test.describe('analog downlink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
    });

    test.afterEach(async ( {page} ) => new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(downlinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump);
            await mainPage.expandLogs();
            await expect(mainPage.getDumpInLogs(command.hex.dump)).toBeVisible();
            await expect(page.getByText(command.hex.lrc)).toBeVisible();
        });
    }
});

test.describe('analog downlink commands - create messages', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
    });

    test.afterEach(async ( {page} ) => new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(downlinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = new MainPage(page);

            if ( command.hardwareType ) {
                await mainPage.selectHardwareType(command.hardwareType);
            }

            for ( const [, subCommand] of Object.entries(command.commands) ) {
                await mainPage.createMessage(subCommand, 'downlink');
            }

            await mainPage.buildMessage().click();
            await mainPage.expandLogs();
            await expect(mainPage.getDumpInLogs(command.hex.dump)).toBeVisible();
            await expect(page.getByText(command.hex.lrc)).toBeVisible();
        });
    }
});
