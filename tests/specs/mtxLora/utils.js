import {expect} from '@playwright/test';

const checkMtxMessage = async ( page, command, mtxCommands, counter ) => {
    await expect(page.getByText(command.mtx.dump)).toBeVisible();
    await expect(page.getByText(command.mtx.accessLevel)).toBeVisible();
    await expect(page.getByText(command.mtx.lrc)).toBeVisible();
    await expect(page.getByRole('link', {name: mtxCommands.name, exact: true}).nth(0)).toBeVisible();
    expect(JSON.parse(await page.getByLabel('json', {exact: true}).innerText()))
        .toStrictEqual(mtxCommands[counter].parameters);
};

const checkAnalogMessage = async ( page, analogCommands, counter ) => {
    await expect(page.getByText(analogCommands[counter].dump, {exact: true})).toBeVisible();
    await expect(page.getByRole('link', {name: analogCommands[counter].name, exact: true}).nth(0)).toBeVisible();
    expect(JSON.parse(await page.getByLabel('json', {exact: true}).innerText()))
        .toStrictEqual(analogCommands[counter].parameters);
};


export const validateMtxLoraMessage = async ( page, format, command, direction ) => {
    const messages = await page.getByTestId('UnfoldMoreIcon').all();
    const closeMessages = await page.getByTestId('UnfoldLessIcon').all();
    const analogCommands = Object.values(command.analog.commands);
    const mtxCommands = Object.values(command.mtx.commands);

    for ( let index = 1; index < messages.length; index++ ) {
        await messages[index].click();

        const buttons = await page.locator('text="json"').elementHandles();

        for ( let counter = 0; counter < buttons.length; counter++ ) {
            await buttons[counter].click();

            if ( index === 1 ) {
                direction === 'downlink'
                    ? await checkMtxMessage(page, command, mtxCommands, counter)
                    : await checkAnalogMessage(page, analogCommands, counter);
            } else {
                direction === 'downlink'
                    ? await checkAnalogMessage(page, analogCommands, counter)
                    : await checkMtxMessage(page, command, mtxCommands, counter);
            }
        }

        await closeMessages[index].click();
    }
};
