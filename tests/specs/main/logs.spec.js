import fs from 'fs';
import * as path from 'path';
import {expect, test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';
import {validateMtxFrames} from '../mtx/utils.js';


const link = `
    jooby-gui#logs=NoKABBYN7pcEQGMD2BbVBDAdgEwCoCeADgKbwBcY82GANsgObwA0scE8AFhgE44DuvEoVIUwARgBMrdpHg4AljxKIALguRYRZStLbt
    4CgM4ARDKowAxHhlQ6wAMzpGSM2VWMBZVQA8AMsg2Yk60Lm6yXCQ+YvDiDmAADADsiQCsiQAsmWCSkmAAzOmSABxgSUks+gg45hhiMO4GKOjYOEZioI2N
    DV29SGiYuPVVvV2GOGLixZL54aN9WLb28ACuRgDq5iQ8niSq2wDCA62V8-PySirqmtpiemejXBhGAAq8S-s87ZSqPCuuIweCFoJCwDFUnDExTmQIMRHed
    k+32ggNhBhBYIhYgyMLRERqFg6qLxshxxJJcHyZIp81Ss3JNLAGQSDLRAF1WfMAL64vGRaKUWLxZJpbIJLK5ApFYrwTnuHlyiIKCaC4rFHCSJIOACckgA
    tPkkoU9RkHAA2ABGeotyQwevECTiFotkimZtSklOJMMRgAoj54bgSCrHM4SIqwFzWWzeQYLQR9sjOkD8uJY40kun3Kks6Tc+xqSnCw86fm4Myy5BxOJtd
    H8-BaDxEMNYfBlIgSAoAG7ByY1yscRB0RArWhbEPV2vc1EKxryLYxYoAenyCSXkgSkhxEgS5FS2r32rAAEFPF6IqpiMs7EYjBgGGRY+MYogMogzfkSGbE
    HqN5I7RkGAdnqQHFEkeqpCQDjFCQSQWtqzqSNq54GMY-qBjgvaUCEYSovAFgMEmrLwBaKwKLQEz1jQ9BMPWN53g+sqNDGeEODYdhvOxezbMiUCzu48D0f
    eJCcR8PH1FGcD8RAPQRM0gz4FeMSoL44godUlxqBoWhKboT7GGYFjWEsYi-P8+lGN4-iBHU2Fhk+nBRDESQkGAqTiI48QOF5XmuQkCQ7oFZrCjgOQYEy+
    RlKFqaJB5m6Bf5OQBYlq6JAFzJpZl4iIEyR4wWUj54QStkoucQkPgAkiGCRUYgHa3n4JA9rQYg1cR8mtERsKyWi-QtEMlA9RSz6UNWaYRnOix2DED6qAA
    EnQDicMgKxfL6WDbAwCgkO0A5jIo7bXDpoh6RNAncK8CLcV8pl-ACjIcBi4KQqNOZnRE8JcUiLYPdUC6De9ZzwAQJC8Hc42-XOqCaFip2QwJBL2PkgONN
    JkPwA4ShGPNi3Latkx7ec3C0EtK1fAAcisqAWtsdyE48oKbdtvEo48x4ANREvDvTMtqZr03ixQ1pIrO9Cx3MGMeeoAEqc5QyYS7IUglNCotnOIH7FBkav
    MTrkCSQ9aPDY5ApUMFiShf+EUSHFcV5A6mUbplqWJRl-lMSSRtAiNVDauIppfg4+S-paP4ZCQ2rFHqupJNqerirk0wWnVRqegLHh+gGrRYaGoThrCBti-
    W8aJlzQJtbCGt7VXEZjdX9Kwhk9xAmama123ld7c3Dw17CFcpt3Zz9w8GSq33e1msWQ97cPZwlHWxGNs2AOtu2nY9iGJR7Ugw6juOdzFKyhfsF7HCI4uK
    5rn+24Ooe5BNyeZ5PpeJ1UGxJn6SG8BwYgxSt+IwcMiYSjoBHAwdtSAX1OIVICRigOEkIgfyTdkIWXQtnEMOF7oCQIl1R4pFyKUWIipHwal6zv2mqicWA
    lyEiSut9FejwX72CFvWTC2MFCLCOmId0dI3rnCMGTDs3DUh0m1qjJ85VaFfXEgwvoQF6pGEas1VqtUFEAGkSAEBiIlR0iQ8gJEiuKUUCQzSJBSLAxIR4E
    jhQSBaRIOUEihQSH5Bw6kBIuAYHYLAFgjoAGUdpGG0lVFRRCAnCWCZQFkqN9BRg5EAA
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
