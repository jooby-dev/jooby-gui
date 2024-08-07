import {expect} from '@playwright/test';


export const validateMtxFrames = async ( page, command ) => {
    const messages = await page.getByTestId('UnfoldMoreIcon').all();
    const closeMessages = await page.getByTestId('UnfoldLessIcon').all();
    const mtxCommands = Object.values(command.commands);

    for ( let index = 1; index < messages.length; index++ ) {
        await messages[index].click();

        const buttons = await page.locator('text="json"').elementHandles();

        await expect(page.getByText(command.hex.frameType)).toBeVisible();
        await expect(page.getByText(command.hex.accessLevel)).toBeVisible();
        await expect(page.getByText(command.hex.dstAddress)).toBeVisible();
        await expect(page.getByText(command.hex.srcAddress)).toBeVisible();
        await expect(page.getByText(command.hex.lrc)).toBeVisible();

        for ( let counter = 0; counter < buttons.length; counter++ ) {
            await buttons[counter].click();

            await expect(page.getByText(mtxCommands[counter].dump)).toBeVisible();
            expect(JSON.parse(await page.getByLabel('json', {exact: true}).innerText()))
                .toStrictEqual(mtxCommands[counter].parameters);
        }

        await closeMessages[index].click();
    }
};
