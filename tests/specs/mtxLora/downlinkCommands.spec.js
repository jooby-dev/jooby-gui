import {test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {downlinkCommands} from '../../fixtures/mtxLora/commands.js';
import {validateMtxLoraMessage} from './utils.js';


test.describe('mtxLora downlink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectMtxLoraCodec();
    });

    test.afterEach(async ( {page} ) => await new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(downlinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump, true);
            await validateMtxLoraMessage(page, 'hex', command, 'parse');
        });
    }
});

test.describe('mtxLora downlink commands - create messages', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectMtxLoraCodec();
    });

    test.afterEach(async ( {page} ) => await new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(downlinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = new MainPage(page);

            if ( command.hardwareType ) {
                await mainPage.selectHardwareType(command.hardwareType);
            }

            for ( const [, subCommand] of Object.entries(command.mtx.commands) ) {
                await mainPage.createMessage(subCommand, 'downlink');
            }

            await mainPage.buildMessage();
            await validateMtxLoraMessage(page, 'hex', command, 'build');
        });
    }
});
