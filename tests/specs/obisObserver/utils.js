import {expect} from '@playwright/test';


export const validateObisObserverMessages = async ( page, command ) => {
    const messages = await page.getByTestId('UnfoldMoreIcon').all();
    const closeMessages = await page.getByTestId('UnfoldLessIcon').all();
    const mtxCommands = Object.values(command.commands);

    for ( let index = 1; index < messages.length; index++ ) {
        await messages[index].click();

        const buttons = await page.locator('text="json"').elementHandles();

        for ( let counter = 0; counter < buttons.length; counter++ ) {
            await buttons[counter].click();

            await expect(page.getByText(mtxCommands[counter].dump).last()).toBeVisible();
            expect(JSON.parse(await page.getByLabel('json', {exact: true}).innerText()))
                .toStrictEqual(mtxCommands[counter].parameters);
        }

        await closeMessages[index].click();
    }
};
