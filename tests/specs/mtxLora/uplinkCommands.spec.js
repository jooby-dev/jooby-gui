import {test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {uplinkCommands} from '../../fixtures/mtxLora/commands.js';
import {validateMtxLoraMessage} from './utils.js';


test.describe.fixme('mtxLora uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectMtxCodec(false);
        await new MainPage(page).chooseUplinkDirection();
    });

    test.afterEach(async ( {page} ) => await new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump, true);
            await validateMtxLoraMessage(page, 'hex', command, 'parse');
        });
    }
});

test.describe.fixme('mtxLora uplink commands - parse base64 dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectMtxCodec(false);
        await new MainPage(page).chooseBase64();
        await new MainPage(page).chooseUplinkDirection();
    });

    test.afterEach(async ( {page} ) => await new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.base64, true);
            await validateMtxLoraMessage(page, 'base64', command, 'parse');
        });
    }
});

test.describe.fixme('mtxLora uplink commands - create messages', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectMtxCodec(false);
    });

    test.afterEach(async ( {page} ) => await new MainPage(page).deleteLogs());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ( {page} ) => {
            const mainPage = new MainPage(page);

            if ( command.hardwareType ) {
                await mainPage.selectHardwareType(command.hardwareType);
            }

            for ( const [, subCommand] of Object.entries(command.mtx.commands) ) {
                await mainPage.createMessage(subCommand, 'uplink');
            }

            await mainPage.createMtxLoraMessage(command.mtx.message);
            await mainPage.buildMessage();
            await validateMtxLoraMessage(page, 'hex', command, 'build');
        });
    }
});
