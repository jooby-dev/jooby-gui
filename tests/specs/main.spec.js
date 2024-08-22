import {test, expect} from '@playwright/test';
import {MainPage} from '../objects/MainPage.js';
import {commandTypes} from '../../src/js/constants/index.js';
import {commandTypeConfigMap} from '../../src/js/joobyCodec.js';


const expectedTexts = {
    titles: ['Parse messages', 'Create message', 'Logs'],
    descriptions: [
        'May be required for parsing and creating a message',
        '',
        'Batch processing supported, each dump on a new line',
        'Commands in the message must be of the same direction'
    ],
    analog: {
        options: commandTypeConfigMap.analog.hardwareTypeList,
        commands: commandTypeConfigMap.analog.preparedCommandList.map(command => command.value.name.toString())
    },
    mtx: {
        commands: commandTypeConfigMap.mtx.preparedCommandList.map(command => command.value.name.toString())
    },
    obisObserver: {
        commands: commandTypeConfigMap.obisObserver.preparedCommandList.map(command => command.value.name.toString())
    }
};


const validateMtxCommands = $commandsOptions => {
    $commandsOptions.forEach(command => {
        if (command.includes('(LoRa only)')) {
            command = command.split(' ')[0];

            expect(['getHalfhoursEnergies', 'getDayEnergies', 'getDayMaxPower']).toContain(command);
        }

        expect(expectedTexts.mtx.commands).toContain(command);
    });
};


test.describe('main page - positive cases', () => {
    test.beforeEach(async ( {page, baseURL} ) => await page.goto(baseURL));

    test('check visibility elements on the page', async ( {page} ) => {
        const mainPage = new MainPage(page);

        expect(await mainPage.getAllTitleTexts()).toEqual(expectedTexts.titles);
        expect(await mainPage.getAllDescriptionTexts()).toEqual(expectedTexts.descriptions);
        expect(await mainPage.getAllSelectOption(MainPage.codec, true)).toEqual(Object.values(commandTypes));

        await expect(mainPage.getParseButton()).toBeVisible();
        await expect(mainPage.getAddCommandButton()).toBeVisible();
        await expect(mainPage.redirectToGithub()).toBeVisible();
        await expect(mainPage.redirectToGithub()).toHaveAttribute('href', 'https://github.com/jooby-dev/jooby-gui');
        await expect(mainPage.getTime2000Converter()).toBeVisible();
    });

    test.describe('validate commands in all codecs', () => {
        test.describe('check analog view', () => {
            test('validate hardware types and commands for analog codec', async ( {page} ) => {
                const $hardwareOptions = await new MainPage(page).getAllSelectOption(MainPage.hardwareType);
                const $commandsOptions = await new MainPage(page).getAllSelectOption(MainPage.command);

                expectedTexts.analog.options.forEach((option, index) => {
                    expect($hardwareOptions[index]).toEqual(option.label);
                });
                expect($commandsOptions.length).toEqual(expectedTexts.analog.commands.length);
                $commandsOptions.forEach(command => expect(expectedTexts.analog.commands).toContain(command));
            });

            test('add commands to message and clear', async ( {page} ) => {
                const $buildMessageButton = await page.getByRole('button', {name: 'Build message'});
                const $clearCommandsButton = await page.getByRole('button', {name: 'Clear commands'});

                await new MainPage(page).createMessage({name: 'getCurrent'}, 'downlink');
                await expect($buildMessageButton).toBeVisible();
                await expect($clearCommandsButton).toBeVisible();
                await $clearCommandsButton.click();
                await expect($buildMessageButton).not.toBeVisible();
                await expect($clearCommandsButton).not.toBeVisible();
            });
        });

        test.describe('check mtx frame view', () => {
            test.beforeEach(async ( {page, baseURL} ) => {
                await page.goto(baseURL)
                await new MainPage(page).selectMtxCodec();
            });

            test('validate commands for mtx codec', async ( {page} ) => {
                const $commandsOptions = await new MainPage(page).getAllSelectOption(MainPage.command);

                await expect(await page.locator('[name="accessKey"]').inputValue()).toEqual('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f');
                expect($commandsOptions.length).toEqual(expectedTexts.mtx.commands.length);

                validateMtxCommands($commandsOptions);
            });

            test('add commands to frame and clear', async ( {page} ) => {
                const $buildFrameButton = await page.getByRole('button', {name: 'Build frame'});
                const $clearCommandsButton = await page.getByRole('button', {name: 'Clear commands'});

                await new MainPage(page).createMessage('getEventStatus', 'downlink');

                const $accessLevels = await new MainPage(page).getAllSelectOption('Access level');

                // missile click
                await page.locator('#menu-accessLevel div').first().click();
                await expect(await page.locator('[name="source"]').inputValue()).toEqual('ff fe');
                await expect(await page.locator('[name="destination"]').inputValue()).toEqual('ff ff');
                await expect(await page.locator('[name="accessKey"]').nth(1).inputValue()).toEqual('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f');
                await expect(await page.locator('[name="messageId"]').inputValue()).toEqual('0');

                $accessLevels.forEach(level => {
                    expect(['Read only', 'Read and write', 'Root', 'Unencrypted']).toContain(level);
                });

                await expect($buildFrameButton).toBeVisible();
                await expect($clearCommandsButton).toBeVisible();
                await $clearCommandsButton.click();
                await expect($buildFrameButton).not.toBeVisible();
                await expect($clearCommandsButton).not.toBeVisible();
            });
        });

        test.describe('check mtx none frame view', () => {
            test.beforeEach(async ( {page, baseURL} ) => {
                await page.goto(baseURL)
                await new MainPage(page).selectMtxCodec(false);
            });

            test('validate commands for mtxLora codec', async ( {page} ) => {
                const $commandsOptions = await new MainPage(page).getAllSelectOption(MainPage.command);

                await expect(await page.locator('[name="accessKey"]').inputValue()).toEqual('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f');
                expect($commandsOptions.length).toEqual(expectedTexts.mtx.commands.length);

                validateMtxCommands($commandsOptions);
            });

            test('add commands to message and clear', async ( {page} ) => {
                const $buildMessageButton = await page.getByRole('button', {name: 'Build message'});
                const $clearCommandsButton = await page.getByRole('button', {name: 'Clear commands'});

                await new MainPage(page).createMessage('getEventStatus', 'downlink');

                const $accessLevels = await new MainPage(page).getAllSelectOption('Access level');

                // missile click
                await page.locator('#menu-accessLevel div').first().click();
                await expect(await page.locator('[name="accessKey"]').nth(1).inputValue()).toEqual('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f');
                await expect(await page.locator('[name="messageId"]').inputValue()).toEqual('0');
                await expect(await page.locator('[name="segmentationSessionId"]').inputValue()).toEqual('0');

                $accessLevels.forEach(level => {
                    expect(['Read only', 'Read and write', 'Root', 'Unencrypted']).toContain(level);
                });

                await expect($buildMessageButton).toBeVisible();
                await expect($clearCommandsButton).toBeVisible();
                await $clearCommandsButton.click();
                await expect($buildMessageButton).not.toBeVisible();
                await expect($clearCommandsButton).not.toBeVisible();
            });
        });

        test.describe('check obisObserver view', () => {
            test.beforeEach(async ( {page, baseURL} ) => {
                await page.goto(baseURL)
                await new MainPage(page).selectObisObserverCodec();
            });

            test('validate commands for obisObserver codec', async ( {page} ) => {
                const $commandsOptions = await new MainPage(page).getAllSelectOption(MainPage.command);

                expect($commandsOptions.length).toEqual(expectedTexts.obisObserver.commands.length);
                $commandsOptions.forEach(command => expect(expectedTexts.obisObserver.commands).toContain(command));
            });

            test('add commands to message and clear', async ( {page} ) => {
                const $buildMessageButton = await page.getByRole('button', {name: 'Build message'});
                const $clearCommandsButton = await page.getByRole('button', {name: 'Clear commands'});

                await new MainPage(page).createMessage({
                        name: 'getObserverInfo',
                        parameters: {requestId: 7}
                    },
                    'downlink');

                await expect($buildMessageButton).toBeVisible();
                await expect($clearCommandsButton).toBeVisible();
                await $clearCommandsButton.click();
                await expect($buildMessageButton).not.toBeVisible();
                await expect($clearCommandsButton).not.toBeVisible();
            });
        });
    });
});



