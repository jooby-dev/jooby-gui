import {test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {validateMtxFrames} from './utils.js';
import fixture from '../../fixtures/main.js';
import {uplinkCommands} from '../../fixtures/mtx/commands.js';


test.describe('mtx uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectCodec(fixture.codecType.options.MTX);
    });

    test.afterEach(({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump);
            await page.waitForTimeout(5000);
            await validateMtxFrames(page, command);
        });
    }
});

// todo: need to fix issue #39623
test.describe.fixme('mtx uplink commands - create messages', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectCodec(fixture.codecType.options.MTX);
    });

    test.afterEach(({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = new MainPage(page);

            for ( const [, subCommand] of Object.entries(command.commands) ) {
                await mainPage.createMessage(subCommand, 'uplink');
            }

            if ( 'frame' in command ) {
                await mainPage.createFrame(command.frame);
            }

            await mainPage.buildFrame();
            await validateMtxFrames(page, command);
        });
    }
});
