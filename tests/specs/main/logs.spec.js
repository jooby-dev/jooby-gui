import fs from 'fs';
import * as path from 'path';
import {expect, test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {validateMtxFrames} from '../mtx/utils.js';


const link = `
    jooby-gui#logs=NobwRAxg9gtjCGA7AJgFQJ4AcCmYBcYS8ANlAOZgA0YAFvAE7IDuD2GO+AjAEzXICW9bBAAu-KIgBy8GLgIBXTMX6IA1lTD8AzgF
    kRADwAyUevHwAzEluzUa2ffjCdzAAgAMAdncBWdwBZ-F25uFwBmX24ADhcPDw1keBEzPHBoOCRkLXxQSFgEFHxwfmQuSO5Q6kQZOTB5LQB1ROx6HWwR
    ZoBhPIz4wWExCXY5Xlp4LQAFBmr2+iy8EXp5GzBibEQyERp8SOpMKdkZufBV9c38Pz5E5OAL0IvvCr83AF0AX1t7R2d3LzdfNwCAKCIXCQUiYHemhKB
    EikWQ3A85gAnNwALShDzhVF+cwANgARqj8Z54KjOG5nPj8dxOJFcd5uBptABRfR7FDYaGWYjWV7Paj49DtObAUKcSgeSjeSgXW73R5uSicThI-kregQ
    QpgIQQbD8ABunK4KuoEBIEHkxCa0OVSNekIS7UckQA9KE3C7uG5uBcXOS8N4kQGkS4AII6DQiLA1WRaLTwMi4ajFRwQPwQXGhbC4iCor3cUl+eC61HF
    yIeVHebDmSLYDz4pFU7hIplaVns5BGvDc6zUJJkEVgfHyfjEErUIikCjUWPxxNgNXmUyySbLtrNI6Q2cJ7Cr6Ybwr2yipbooIaOGAGTi9HUDKTVRyKZ
    RqVt6IwmZI95Z2BwEDzYFxvE4FxzFcUCQLAgC3DcP0YPJFxcVcNxkCCeAXD8UIYhQsV3GA71YPcGCvUIsIYOg9CyMov0IHQkNaxiJMwEdZJwG3RMAEl
    oUVQgIF1ONDGwQ1iHwbi0nyTJshPdIChSKFjXFMAqlkRxExEAAJEhzBoKB5FmZlEGaMh+GwLI+D6URxEQc88BGOgJn2ddZnwBYlmoE4Ni2PBOGlMA9j
    XQ4tUdORwHQbAGHwGkZwkM4bMuJ08FCSFzEELR1M07TdK4Wx0p02ZJHkGB8WaCLqDWQzjKOMBQwAamyJ4kVxShIhVbg1VDVEACVarwYAeCiHZOEzSI-
    DeSEf0cRD3BQgt0Mw5VcPcEJ4PI4jyPdEinkIiFk2hMAkU4HFs3MUI8wJXM-GwJFIlRFEPCRVEAWCMp8V4zFGWTNs2QyLsvz5AUhRM7JFUGpVGuVcVO
    EeXhcUlThYcoXgQcVUJeEVPwdkVXELkVRUojVYgNS1HU9UNaEolNc1LWtCLIiPJimmdN0PXzX1-UDPA-BCcNI2jRwlwfHbHHrCA6Q8SHsU7a6i2QE6k
    SLNFvLcSJzG4CBoM5lsPvbb6uSsZZ+0HYdR3HMBL30a9qH55TFzXPcDgPWSow4PBmr4EyxCqO98HpB4fK0XLdW97wHj8LcTLnXcHIC2Tiz4rQBKEkSJ
    148OAGlsHQRxyIpRb3EwoE-ncXEfncaI3BDNw0LcfF3Bo5D3Cg8wNGsMhZEQJI7wAZXDyzOKT03w53Pu8Dce1niAA
`.replace(/\s+/g, '');

const normalize = content => content.replace(/\r\n/g, '\n').trim();

const expectedData = {
    analogDump: '1f 07 05 04 04 22 35 28 77',
    mtxDump: '7e 51 ff ff ff fe 00 10 10 6f 0d 2a 43 7d 31 01 02 10 00 20 00 30 00 40 00 00 1c 49 8e 7e',
    command: {
        hex: {
            dump: '7e 50 15 75 ff fe 7d 31 7d 33 49 4d 4c 74 cd 8d 29 d5 36 a8 76 f6 72 ac 36 5f f9 ae 7e',
            frameType: 'DATA_RESPONSE (0x51)',
            accessLevel: 'UNENCRYPTED',
            dstAddress: '0xffff',
            srcAddress: '0xfffe',
            messageId: '0',
            lrc: '0xb5'
        },
        commands: {
            getHalfhoursEnergies: {
                name: 'getHalfhoursEnergies',
                dump: '6f 0d 31 2d 11 01 02 0b b8 1b 58 2e e0 3a 98',
                parameters: {
                    date: {
                        year: 24,
                        month: 9,
                        date: 13
                    },
                    firstHalfhour: 1,
                    halfhoursNumber: 2,
                    energies: {
                        'A+': [
                            3000,
                            7000
                        ],
                        'A-R+': [
                            12000,
                            15000
                        ]
                    }
                }
            }
        }
    }
};


test.describe('logs actions', () => {
    let mainPage;

    test.beforeEach(async ( {page, baseURL} ) => {
        await page.goto(`${baseURL}${link}`);
        mainPage = new MainPage(page);
    });

    test('expand/collapse logs', async ({page}) => {
        await mainPage.expandLogs();
        await expect(await page.locator('[data-test="hex"]').all()).toHaveLength(12);
        await mainPage.collapseLogs().click();
        await expect(await page.locator('[data-test="hex"]').all()).toHaveLength(0);
    });

    test('share logs - create link', async ( {page, context} ) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await mainPage.shareLogs().click();

        const alert = page.getByRole('alert');
        const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
        const clipboardContent = await handle.jsonValue();

        await expect(alert).toHaveText('Logs sharing link copied to clipboard');

        expect(clipboardContent).toContain('jooby-gui#logs=');

        await context.close();
    });

    test('share logs - open link', async ( {page, baseURL} ) => {
        await page.goto(`${baseURL}${link}`);

        expect(page.url()).toEqual(`${baseURL}jooby-gui`);
        await expect(page.getByRole('heading', {name: 'Logs:'})).toHaveText('Logs: 2');
    });

    test('edit as new', async ({page}) => {
        await mainPage.editAsNew('mtx1 (commands: 1)', expectedData.command.commands.getHalfhoursEnergies.parameters);
        await mainPage.deleteLogs();
        await mainPage.buildFrame().click();
        await mainPage.clearCommands().click();
        await validateMtxFrames(page, expectedData.command);
    });

    test('delete logs', async ({page}) => {
        const root = page.locator('.MuiBox-root');

        await mainPage.deleteLogs();

        for ( const element of ['UnfoldMoreIcon', 'UnfoldLessIcon', 'ShareIcon', 'DeleteIcon'] ) {
            await expect(root.locator(`[data-testid="${element}"]`)).toBeDisabled();
        }
    });
});

test.describe('file import/export', () => {
    const directory = 'tests/data/main';
    const fileName = 'import.json';
    const fullPath = `${directory}/${fileName}`;

    test('import logs from file', async ( {page, baseURL} ) => {
        await page.goto(baseURL);

        const fileWithPath = path.join(directory, fileName);
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.getByLabel('Import logs').click()
        ]);

        await fileChooser.setFiles([fileWithPath]);
        await new MainPage(page).expandLogs();

        await expect(page.getByRole('heading', {name: 'Logs:'})).toHaveText('Logs: 2');
        await expect(page.getByText(expectedData.analogDump)).toBeVisible();
        await expect(page.getByText(expectedData.mtxDump)).toBeVisible();
    });

    test('export logs to file', async ( {page, baseURL} ) => {
        await page.goto(`${baseURL}${link}`);

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.getByLabel('Export logs').click()
        ]);
        const filePath = `tests/data/main/${download.suggestedFilename()}`;

        await download.saveAs(filePath);

        const downloadedFile = fs.readFileSync(filePath, 'utf8');
        const originalFile = fs.readFileSync(fullPath, 'utf8');

        expect(normalize(downloadedFile)).toBe(normalize(originalFile));
        expect(fs.existsSync(filePath)).toBeTruthy();
        fs.unlinkSync(filePath);
    });
});
