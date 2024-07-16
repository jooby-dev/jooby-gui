import {test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import fixture from '../../fixtures/main.js';
import {uplinkCommands} from '../../fixtures/mtxLora/commands.js';
import {validateMtxLoraMessage} from './utils.js';


test.describe('mtxLora uplink commands - parse hex dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectCodec(fixture.codecType.options.MTX_LORA);
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ({page}) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.hex.dump);

            await validateMtxLoraMessage(page, fixture.parseMessages.format.hex, command, 'uplink');
        });
    }
});

test.describe('mtxLora uplink commands - parse base64 dumps', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await new MainPage(page).selectCodec(fixture.codecType.options.MTX_LORA);
        await page.getByLabel(fixture.parseMessages.format.base64).click();
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    for ( const [commandKey, command] of Object.entries(uplinkCommands) ) {
        test(`check ${commandKey}`, async ({page}) => {
            const mainPage = await new MainPage(page);

            await mainPage.parseDump(command.base64);

            await validateMtxLoraMessage(page, fixture.parseMessages.format.base64, command, 'uplink');
        });
    }
});
