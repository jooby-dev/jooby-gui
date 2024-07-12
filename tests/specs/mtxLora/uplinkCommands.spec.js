import {test, expect} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import fixture from '../../fixtures/main.js';
import {uplinkCommands} from '../../fixtures/mtxLora/commands.js';


test.describe('', () => {
    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        await page.getByLabel('Codec').click();
        await page.getByText('mtxLora').click();
        await page.getByLabel(fixture.parseMessages.directions.uplink).click();
    });
    test.afterEach(async ({page}) => page.getByLabel(fixture.logs.buttons.deleteLogs).click());

    test('2', async ({ page }) => {
        const mainPage = await new MainPage(page);

        await mainPage.parseDump(uplinkCommands.getDateTime.hex.dump);
        //await mainPage.expandLogs();

        let format = fixture.parseMessages.format.hex
        const messages = await page.getByTestId('UnfoldMoreIcon').all()
        const closeMessages = await page.getByTestId('UnfoldLessIcon').all()
        const analogCommands = Object.values(uplinkCommands.getDateTime.analog.commands);
        const mtxCommands = Object.values(uplinkCommands.getDateTime.mtx.commands);

        for (let index = 1; index < messages.length; index++ ) {
            await messages[index].click();

            const buttons = await page.locator('text="json"').elementHandles();

            for (let counter = 0; counter < buttons.length; counter++) {
                await buttons[counter].click();

                if ( index > 1 ) {
                    await expect(page.getByText(uplinkCommands.getDateTime.mtx.dump)).toBeVisible()
                    await expect(page.getByText(uplinkCommands.getDateTime.mtx.accessLevel)).toBeVisible()
                    await expect(page.getByText(uplinkCommands.getDateTime.mtx.lrc)).toBeVisible()

                }
/*                if (index === 1) {
                    format === fixture.parseMessages.format.hex
                        ? await expect(page.getByText(analogCommands[index].dump)).toBeVisible()
                        : await expect(page.getByText(analogCommands[index].dump)).toHaveCount(2);
                } else {
                    format === fixture.parseMessages.format.hex
                        ? await expect(page.getByText(mtxCommands[index].dump)).toBeVisible()
                        : await expect(page.getByText(mtxCommands[index].dump)).toHaveCount(2);
                }*/


                //await expect(page.getByRole('link', {name: analogCommands[index].name})).toBeVisible();
                //await expect(page.getByText(command.hex.lrc)).toBeVisible();
                console.log('itteration: ' + counter)
                console.log(analogCommands)
                if (index === 1) {
                    expect(JSON.parse(await page.getByLabel('json', {exact: true}).innerText()))
                        .toStrictEqual(analogCommands[0].parameters);
                } else {
                    expect(JSON.parse(await page.getByLabel('json', {exact: true}).innerText()))
                        .toStrictEqual(mtxCommands[0].parameters);
                }

            }


            await closeMessages[index].click();
        }
    })
})
