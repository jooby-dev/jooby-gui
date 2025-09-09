import {expect, test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {commandTypeConfigMap} from '../../../src/js/joobyCodec.js';


const accessKey = '00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f';

const commands = {
    analog: {
        options: commandTypeConfigMap.analog.hardwareTypeList,
        commands: commandTypeConfigMap.analog.preparedCommandList.map(command => command.value.name.toString())
    },
    mtx1: {
        commands: commandTypeConfigMap.mtx1.preparedCommandList.map(command => command.value.name.toString())
    },
    obisObserver: {
        commands: commandTypeConfigMap.obisObserver.preparedCommandList.map(command => command.value.name.toString())
    }
};


const validateMtxCommands = $commandsOptions => {
    $commandsOptions.forEach(command => {
        if ( command.includes('(LoRa only)') ) {
            [command] = command.split(' ');

            expect(['getHalfHourEnergies', 'getDayEnergies', 'getDayMaxPower']).toContain(command);
        }

        expect(commands.mtx1.commands).toContain(command);
    });
};


test.describe('validate commands in all codecs', () => {
    let mainPage;

    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(baseURL);
        mainPage = new MainPage(page);
    });

    test.describe('check analog view', () => {
        test('validate hardware types and commands for analog codec', async ( {page} ) => {
            const $hardwareOptions = await new MainPage(page).getAllSelectOption(MainPage.hardwareType);
            const $commandsOptions = await new MainPage(page).getAllSelectOption(MainPage.command);

            commands.analog.options.forEach((option, index) => {
                expect($hardwareOptions[index]).toEqual(option.label);
            });
            expect($commandsOptions.length).toEqual(commands.analog.commands.length);
            $commandsOptions.forEach(command => expect(commands.analog.commands).toContain(command));
        });

        test('add commands to message and clear', async () => {
            await mainPage.createMessage({name: 'getCurrent'}, 'downlink');
            await expect(mainPage.buildMessage()).toBeVisible();
            await expect(mainPage.clearCommands()).toBeVisible();
            await mainPage.clearCommands().click();
            await expect(mainPage.buildMessage()).toBeHidden();
            await expect(mainPage.clearCommands()).toBeHidden();
        });
    });

    test.describe('check mtx frame view', () => {
        test.beforeEach(async ( {page, baseURL} ) => {
            await page.goto(baseURL);
            await mainPage.selectMtxCodec();
        });

        test('validate commands for mtx codec', async ( {page} ) => {
            const $commandsOptions = await mainPage.getAllSelectOption(MainPage.command);

            await expect(page.locator('[name="accessKey"]')).toHaveValue(accessKey);
            expect($commandsOptions.length).toEqual(commands.mtx1.commands.length);

            validateMtxCommands($commandsOptions);
        });

        test('add commands to frame and clear', async ( {page} ) => {
            await mainPage.createMessage('getEventStatus', 'downlink');

            const $accessLevels = await mainPage.getAllSelectOption('Access level');

            // missile click
            await page.locator('#menu-accessLevel div').first().click();
            await expect(mainPage.getSourceAddress()).toHaveValue('ff fe');
            await expect(mainPage.getDestinationAddress()).toHaveValue('ff ff');
            await expect(mainPage.getAccessKey()).toHaveValue(accessKey);
            await expect(mainPage.getMessageId()).toHaveValue('0');

            $accessLevels.forEach(level => {
                expect(['Read only', 'Read and write', 'Root', 'Unencrypted']).toContain(level);
            });

            await expect(mainPage.buildFrame()).toBeVisible();
            await expect(mainPage.clearCommands()).toBeVisible();
            await mainPage.clearCommands().click();
            await expect(mainPage.buildFrame()).toBeHidden();
            await expect(mainPage.clearCommands()).toBeHidden();
        });
    });

    test.describe('check mtx none frame view', () => {
        test.beforeEach(async ( {page, baseURL} ) => {
            await page.goto(baseURL);
            await mainPage.selectMtxCodec(false);
        });

        test('validate commands for mtxLora codec', async ( {page} ) => {
            const $commandsOptions = await mainPage.getAllSelectOption(MainPage.command);

            await expect(page.locator('[name="accessKey"]')).toHaveValue(accessKey);
            expect($commandsOptions.length).toEqual(commands.mtx1.commands.length);

            validateMtxCommands($commandsOptions);
        });

        test('add commands to message and clear', async ( {page} ) => {
            await mainPage.createMessage('getEventStatus', 'downlink');

            const $accessLevels = await mainPage.getAllSelectOption('Access level');

            // missile click
            await page.locator('#menu-accessLevel div').first().click();
            await expect(mainPage.getAccessKey()).toHaveValue(accessKey);
            await expect(mainPage.getMessageId()).toHaveValue('0');
            await expect(mainPage.getSegmentationSessionId()).toHaveValue('0');

            $accessLevels.forEach(level => {
                expect(['Read only', 'Read and write', 'Root', 'Unencrypted']).toContain(level);
            });

            await expect(mainPage.buildMessage()).toBeVisible();
            await expect(mainPage.clearCommands()).toBeVisible();
            await mainPage.clearCommands().click();
            await expect(mainPage.buildMessage()).toBeHidden();
            await expect(mainPage.clearCommands()).toBeHidden();
        });
    });

    test.describe('check obisObserver view', () => {
        test.beforeEach(async ( {page, baseURL} ) => {
            await page.goto(baseURL);
            await mainPage.selectObisObserverCodec();
        });

        test('validate commands for obisObserver codec', async ( {page} ) => {
            const $commandsOptions = await new MainPage(page).getAllSelectOption(MainPage.command);

            expect($commandsOptions.length).toEqual(commands.obisObserver.commands.length);
            $commandsOptions.forEach(command => expect(commands.obisObserver.commands).toContain(command));
        });

        test('add commands to message and clear', async ( {page} ) => {
            await new MainPage(page).createMessage(
                {
                    name: 'getObserverInfo',
                    parameters: {requestId: 7}
                },
                'downlink'
            );

            await expect(mainPage.buildMessage()).toBeVisible();
            await expect(mainPage.clearCommands()).toBeVisible();
            await mainPage.clearCommands().click();
            await expect(mainPage.buildMessage()).toBeHidden();
            await expect(mainPage.clearCommands()).toBeHidden();
        });
    });
});
