import fs from 'fs';
import * as path from 'path';
import {expect, test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {validateMtxFrames} from '../mtx/utils.js';


const link = `
    jooby-gui#logs=NobwRAxg9gtjCGA7AJgFQJ4AcCmYBcYS8ANlAOZgA0YAFvAE7IDuD2GO+AjAEzUCWAZwAi8AC7wAYvXgxceAGYkB2asj71sEUXyi
    J2c3mEEBZUQA8AMlGn5FxZfwGmztpStrYXBTvIAEABgB2AIBWAIAWCN9ubl8AZjDuAA5fQMCqMGQxeHxwaDgkZAF8UEhYBBRco2QuJO446kQZOTAAVw
    EAdTFsemNsUR6AYXLCjLUNLR09LANqOgEABQZmgfpivFF6VvdibEQyURp8JOpMZdlV9fBd-cP8cNVskoe4h5CG8P8AXQBfOc98GAfAFgv4wv5IhDorE
    EtEkmA-tVAdx4IFXii4gBabAAI04-kx4XkAE54JjiZwIDjMfB4OF4BAQsgAGyBJLIXCOACiZjOKGwNQUbh+X2oOPQA3WwDinEogUoIUoDxebw+-konE
    4xNFYGI9AgVQm2D4ADcBVwtdQICQIK1iN1BZriT9EVkBoDiQB6L3cfzcRW+cJ4GV4cJhBbGDKiGaA2QCATwMicpEEeQ8TjYOLE5A0+Q4nPhOLcZk0jN
    k-ycZCBILEpLZkIG7m8wrmoX2dziMhSsA41p8Yg1ahEUgUahxhNJsA6+TSWRLWf9HpXRHjxPYecrJe5F2UPIjFD6WPmTgZQQicRSZr4TbbVTqTTaXSH
    vCGEzmKw2NsOIxOczXrbuDQAIEIE2C+CEnC+PIfjQVBMFgf4-i+PiyFIcyfj+Mg0TwIGcSpFhMoBJBfrgUhiG+PAZFIdWARIRAVG0chEC+Oh8Q4qkyZ
    ujkeDgKuSYAJKCuqhAQBA2DxhY2BmsQ+DCfkFRFCUe4FJUPEppqspgE0siAkmogABIkPI+lQK09BcogPRkHw4ljPekxPjGL5zPAiznIuaz-reup7AcR
    x4JwipgGcC6XFUbpyOA6DYAw+DcJpMC6HczmZN0+BxIi8jqAIBlGTQpn0FwLnEPI+VmQIAByrQwDiPRxdQexWTZVxgAAggA1EpYDiPQfDQUVYCNfQZD
    oPc-jEsyfzgD1fXyPVg2WcNo14EkWrcCK1CtZiABKnV4KUM39QFDWLSNXAxEkSRTd1DCzelJ1Wct-gijuHheGArGYdhuHIcRxGxCEDGUYxNHkfRtEIv
    wgpgEkJLMrSaKYqyzJJIS8C1pisMQJwmKagygTcDFyB5smgg8nyHKCnYygbT2Eq2ft6qcMyGosxpGofLwrIavKsq8Ek6pM8ygsajwlBM8SvAi8kOp6g
    aalGqarbJFaNp2g6cVXa6aUEF6Pp+gGQZxP4eCA74EZRk5YAzleUOApwRYQPI-jYNg2L+DiECEu8xLksy+KYoEyBxHW2DhEkYlxI2P7ky2VNuNQnbdr
    2-aDmAMDHhkNs6dOC4bhcW5qdGHArZpHI5XwTSPog+DMiE7xBQIBVibX9evCu4kTuu7lhWpDJiRJUnYDJeDCf3ncANLYMtYDkRWASxP4eFQmCATMiCA
    QpONAQ4R7ATMV9LsBHN1DKGQsiIOI1cAMqd1MgmyWO8BmLf597KI198AAXnInxjp3a4H6jxdF8IAA
`.replace(/\s+/g, '');

const normalize = content => content.replace(/\r\n/g, '\n').trim();

const expectedData = {
    analogDump: '1f 07 05 04 04 22 35 28 77',
    mtxDump: '7e 51 ff ff ff fe 00 10 10 6f 0d 2a 43 7d 31 01 02 50 00 a0 00 70 00 c0 00 00 1c 6f 3b 7e',
    command: {
        hex: {
            dump: '7e 51 ff ff ff fe 00 10 10 6f 0d 31 2d 7d 31 01 02 4b b8 9b 58 6e e0 ba 98 00 b5 53 2c 7e',
            frameType: 'DATA_RESPONSE (0x51)',
            accessLevel: 'UNENCRYPTED',
            dstAddress: '0xffff',
            srcAddress: '0xfffe',
            messageId: '0',
            lrc: '0xb5'
        },
        commands: {
            getHalfHourEnergies: {
                name: 'getHalfHourEnergies',
                dump: '6f 0d 31 2d 11 01 02 4b b8 9b 58 6e e0 ba 98',
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
                            {tariff: 1, energy: 3000},
                            {tariff: 2, energy: 7000}
                        ],
                        'A-R+': [
                            {tariff: 1, energy: 12000},
                            {tariff: 2, energy: 15000}
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
        expect(await page.locator('[data-test="hex"]').all()).toHaveLength(12);
        await mainPage.collapseLogs().click();
        expect(await page.locator('[data-test="hex"]').all()).toHaveLength(0);
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
        await mainPage.editAsNew('mtx1 (frame type: DATA_RESPONSE; commands: 1)', expectedData.command.commands.getHalfHourEnergies.parameters);
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
