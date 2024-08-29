import {test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {validateMtxFrames} from './utils.js';
import {downlinkCommands} from '../../fixtures/mtx/commands.js';


test.describe('mtx downlink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectMtxCodec();
    });

    test.afterEach(async ( {page} ) => await new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(downlinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump);
            // eslint-disable-next-line playwright/no-wait-for-timeout
            await page.waitForTimeout(5000);
            await validateMtxFrames(page, command);
        });
    }
});

test.describe('mtx downlink commands - create messages', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectMtxCodec();
    });

    test.afterEach(async ( {page} ) => await new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(downlinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = new MainPage(page);

            for ( const [, subCommand] of Object.entries(command.commands) ) {
                await mainPage.createMessage(subCommand, 'downlink');
            }

            await mainPage.buildFrame();
            await validateMtxFrames(page, command);
        });
    }
});
