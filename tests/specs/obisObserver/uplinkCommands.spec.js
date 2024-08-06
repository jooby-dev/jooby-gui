import {test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {validateObisObserverMessages} from './utils.js';
import fixture from '../../fixtures/main.js';
import {uplinkCommands} from '../../fixtures/obisObserver/commands.js';


test.describe('obisObserver uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectCodec(fixture.codecType.options.OBIS_OBSERVER);
    });

    test.afterEach(async ( {page} ) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump);
            await page.waitForTimeout(5000);
            await validateObisObserverMessages(page, command);
        });
    }
});
