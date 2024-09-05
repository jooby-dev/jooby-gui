import {expect, test} from '@playwright/test';
import {MainPage} from '../../objects/MainPage.js';


const link = `
    jooby-gui#logs=NobwRAxg9gtjCGA7AJgFQJ4AcCmYBcYS8ANlAOZgA0YAFvAE7IDuD2GO+AjAEzXICW9bBAAu
    -KIgBy8GLgIBXTMX6IA1lTD8AzgFkRADwAyUevHwAzEluzUa2ffjCdzAAgAMAdncBWdwBZ-F25uFwBmX24ADhcPDw1keBEzPHBoOCRkLXxQSFgEFH
    xwfmQuSO5Q6kQZOTB5LQB1ROx6HWwRZoBhPIz4wWExCXY5Xlp4LQAFBmr2+iy8EXp5GzBibEQyERp8SOpMKdkZufBV9c38Pz5E5OAL0IvvCr83AF0
    AX1t7R2d3LzdfNwCAKCIXCQUiYHemhKBA8EHgkQARqFIgBOAC0EAAbKFkGi-BAPJw0ZFMW54GjMQlyn58dxMdhuBptABRfR7FDYaGWYjWV7PagI9D
    tObAUKcSgeSjeSgXW73R5uSicTgo-kregQQpgIQQbD8ABunK4KuocOIEHkxCa0OVKNekIS7UckQA9KE3C7uG5uBcXJw3HhvCjAyiXABBHQaERYGqy
    LRaeBkXDUYqOMnccx-SKRDHebAIvGebxohHYbweNEeTF+Ql0+DwBHmBFMrSs9nII14bnWahJMgisAI+T8YglahEUgUahxhNJsBq8ymWSTJdtZpHSE
    zxPYFfTdeFe2UVLdFBDRwwAy9HUDKTVRyKZRqFt6IwmZLd5Z2Bww7AubycFxzFcIDAOA383DcP1IP9FxMVcNxkCCeAXD8UIYkQsV3AA70oPcSCvTw
    sJIIglDiLIv0IBQ0NIl-DxkzAR1knALckwASWhRVCAgXV40MbBDWIfBOLSfJMmyY90gKFIoWNcUwCqWRHCTEQAAkSHMGgoHkWZmUQZoyH4bAsj4PpR
    HERAzzwEY6AmfY11mfAFiWagTg2LY8E4aUwD2VdDi1R05HAdBsAYfBuDkmAJDOKzLidPBQkhcxBC0VT1M07SuFsNKtNmSR5BgUt6DC6g1n0wyjjAMMA
    GpsieFFMUoSIVW4NUwzRAAlGq8GAHgoh2ThsUiPw3khL9HDg9xEO4ZDUL9bDsJCGCSIIkj3UIp48IhFNoTAcxIkzFEEUxIl4CA7A8XMThyUOyIK2QBE
    3Dg8wPGm+AARbNsMk7D8+QFIUjOyRUBqVBrlXFThHl4TFJU4GHKF4YHFVCXhFT8HZFWrShFUVKI1WIDUtR1PVDWhKJTRIC0rXaUnIkPBimmdN0PS9H1
    KCgkM8D8EIIyjGNHEXO9tscbBociBC4IxW63DxRsCzemi0VCbAELe57OGwHgPrZL6uSsZY+wHIcRzHMALwcagBcUhdV13A592k6MODwJq+CMsQqhvfB
    MW8B4vK0HLdS9n27k3IzZx3Oy-Ok+BuLDviBKE8dY-jABpbB0DTYiFvcNCgT+dxMR+dxojcUMyXcBF3EohD3HA8wNGsMhZEQJIbwAZTD8z2MT02w+3bu8Dce1niAA
`.replace(/\s+/g, '');


test.describe('Logs actions', () => {
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

    test('delete logs', async ({page}) => {
        const root = page.locator('.MuiBox-root');

        await mainPage.deleteLogs();

        for ( const element of ['UnfoldMoreIcon', 'UnfoldLessIcon', 'ShareIcon', 'DeleteIcon'] ) {
            await await expect(root.locator(`[data-testid="${element}"]`)).toBeDisabled();
        }
    });
});
