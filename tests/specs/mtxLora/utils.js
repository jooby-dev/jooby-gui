import {expect} from '@playwright/test';

const checkMtxMessage = async ( page, command, mtxCommands ) => {
    await expect(page.locator('p').filter({hasText: command.mtx.dump})).toBeVisible();
    await expect(page.getByText(command.mtx.accessLevel)).toBeVisible();
    await expect(page.getByText(command.mtx.lrc)).toBeVisible();

    for ( let counter = 0; counter < mtxCommands.length; counter++ ) {
        await expect(page.getByRole('link', {name: mtxCommands[counter].name, exact: true}).nth(0)).toBeVisible();
        await expect(page.getByText(mtxCommands[counter].dump, {exact: true})).toBeVisible();
    }
};

const checkAnalogMessage = async ( page, analogCommands ) => {
    const buttons = await page.locator('text="json"').elementHandles();

    for ( let counter = 0; counter < buttons.length; counter++ ) {
        await expect(page.locator(`p.MuiTypography-root:has-text('${analogCommands[counter].dump}')`).nth(1)).toBeVisible();
        await expect(page.getByRole('link', {name: analogCommands[counter].name, exact: true}).nth(0)).toBeVisible();
        await buttons[counter].click();
        expect(JSON.parse(await page.getByLabel('json', {exact: true}).innerText()))
            .toStrictEqual(analogCommands[counter].parameters);
    }
};


export const validateMtxLoraMessage = async ( page, format, command, type ) => {
    const messages = await page.getByTestId('UnfoldMoreIcon').all();
    const closeMessages = await page.getByTestId('UnfoldLessIcon').all();
    const analogCommands = Object.values(command.analog.commands);
    const mtxCommands = Object.values(command.mtx.commands);

    for ( let index = 1; index < messages.length; index++ ) {
        await messages[index].click();

        if ( type === 'parse' ) {
            if ( index === 1 ) {
                await checkAnalogMessage(page, analogCommands, type);
            } else {
                await checkMtxMessage(page, command, mtxCommands);
            }
        }

        if ( type === 'build' ) {
            if ( index === 1 ) {
                await checkMtxMessage(page, command, mtxCommands);
            } else {
                await checkAnalogMessage(page, analogCommands, type);
            }
        }

        await closeMessages[index].click();
    }
};
