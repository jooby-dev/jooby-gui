import {expect} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';


const checkMtxMessage = async ( page, command, mtxCommands ) => {
    await expect(new MainPage(page).getDumpInLogs(command.mtx.dump)).toBeVisible();
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
        const updatedButtons = await page.locator('text="json"').elementHandles();
        await expect(new MainPage(page).getDumpInLogs(analogCommands[counter].dump)).toBeVisible();
        await expect(page.getByRole('link', {name: analogCommands[counter].name, exact: true}).nth(0)).toBeVisible();
        await page.evaluate(button => button.click(), updatedButtons[counter]);

        expect(JSON.parse(await page.getByLabel('json', {exact: true}).nth(counter).innerText()))
            .toStrictEqual(analogCommands[counter].parameters);
    }
};


export const validateMtxLoraMessage = async ( page, format, command, type ) => {
    const analogCommands = Object.values(command.analog.commands);
    const mtxCommands = Object.values(command.mtx.commands);

    for ( let index = 1; ; index++ ) {
        const updatedMessages = await page.getByTestId('UnfoldMoreIcon').all();
        const updatedCloseMessages = await page.getByTestId('UnfoldLessIcon').all();

        if ( index >= updatedMessages.length ) break;

        await updatedMessages[index].dispatchEvent('click');

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

        if ( index >= updatedCloseMessages.length ) break;

        await updatedCloseMessages[index].dispatchEvent('click');
    }
};
