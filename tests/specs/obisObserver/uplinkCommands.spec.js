import {test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {validateObisObserverMessages} from './utils.js';
import {uplinkCommands} from '../../fixtures/obisObserver/commands.js';


test.describe('obisObserver uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectObisObserverCodec();
    });

    test.afterEach(async ( {page} ) => new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump);
            await page.waitForTimeout(5000);
            await validateObisObserverMessages(page, command);
        });
    }
});

test.describe('obisObserver uplink commands - create messages', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectObisObserverCodec();
    });

    test.afterEach(async ( {page} ) => new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = new MainPage(page);

            for ( const [, subCommand] of Object.entries(command.commands) ) {
                await mainPage.createMessage(subCommand, 'uplink');
            }

            await mainPage.buildMessage().click();
            await validateObisObserverMessages(page, command);
        });
    }
});
