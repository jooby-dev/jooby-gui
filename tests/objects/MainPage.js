import {commandTypes} from '../../src/js/constants/index.js';


export class MainPage {
    static codec = 'Codec';
    static hardwareType = 'Hardware type';
    static command = 'Command';

    constructor ( page ) {
        this.page = page;
    }

    formatDump ( dump ) {
        return dump.replace(/(.{2})/g, '$1 ').trim();
    }

    getDumpInLogs ( dump ) {
        return this.page.locator('[data-test="hex"]', {hasText: dump}).first();
    }

    redirectToGithub () {
        return this.page.getByRole('link', {name: 'GitHub'})
    }

    getParseButton () {
        return  this.page.getByTestId('parse-button');
    }

    getAddCommandButton () {
        return  this.page.getByTestId('add-command-button');
    }

    getTime2000Converter () {
        return this.page.getByRole('button', { name: 'Date to time2000 converter' })
    }

    async deleteLogs () {
        await this.page.getByLabel('Delete logs').click();
    }

    async getAllSelectOption ( label, codecSelect = false ) {
        await this.page.getByLabel(label).click();

        const optionElements = await this.page.locator('li[role="option"]').all();
        const options = [];

        for ( const optionElement of optionElements ) {
            const optionText = await optionElement.textContent();
            options.push(optionText.trim());
        }

        // missile click for closing select list
        codecSelect
            ? await this.page.getByRole('option', {name: 'analog'}).click()
            : await this.page.click('body', {
                position: {
                    x: 100,
                    y: 100
                }
            });

        return options;
    }

    async selectCodec ( type ) {
        await this.page.getByLabel('Codec').click();
        await this.page.getByText(type, {exact: true}).click();
    }

    async selectMtxCodec ( frame = true ) {
        await this.selectCodec(commandTypes.MTX);

        if ( !frame ) {
            await this.page.getByLabel('NONE').click();
        }
    }

    async selectObisObserverCodec () {
        await this.selectCodec(commandTypes.OBIS_OBSERVER);
    }

    async selectHardwareType ( type ) {
        await this.page.getByLabel('Hardware type').click();
        await this.page.getByText(type).click();
    }

    async parseDump ( dump, exact = true ) {
        exact
            ? await this.page.getByLabel('Dump', {exact: true}).fill(dump)
            : await this.page.getByLabel('Dump').fill(dump);

        await this.getParseButton().click();
    }

    async expandLogs () {
        await this.page.getByLabel('Expand logs').click();
        await this.page.waitForTimeout(2000);
    }

    async createMessage ( command, direction ) {
        await this.page.getByLabel('Command', {exact: true}).click();

        const option = direction === 'downlink'
            ? this.page.getByRole('option', {name: command.name, exact: true}).first()
            : this.page.getByRole('option', {name: command.name, exact: true}).last();

        await option.click();

        if ( command.parameters ) {
            const textarea = this.page.locator('textarea.ace_text-input');
            await this.page.getByLabel('Clear parameters').click();
            await textarea.fill(JSON.stringify(command.parameters));
        }

        await this.getAddCommandButton().click();
    }

    async buildMessage () {
        await this.page.getByRole('button', {name: 'Build message'}).click();
    }

    async createMtxLoraMessage ( message ) {
        const {accessLevel, messageId, segmentationSessionId} = message;

        if ( accessLevel ) {
            await this.page.getByLabel('Access level').click();
            await this.page.getByText(accessLevel, {exact: true}).click();
        }

        if ( messageId ) {
            const $messageId = this.page.getByLabel('Message ID');
            await $messageId.clear();
            await $messageId.fill(messageId);
        }

        if ( segmentationSessionId ) {
            const $segmentationSessionId = this.page.getByLabel('Segmentation session ID');
            await $segmentationSessionId.clear();
            await $segmentationSessionId.fill(segmentationSessionId);
        }
    }

    async createFrame ( frame ) {
        const {accessLevel, dstAddress, srcAddress, messageId} = frame;

        if ( accessLevel ) {
            await this.page.getByLabel('Access level').click();
            await this.page.getByText(accessLevel, {exact: true}).click();
        }

        if ( srcAddress ) {
            const $srcAddress = this.page.getByLabel('Source address');
            await $srcAddress.clear();
            await $srcAddress.fill(srcAddress);
        }

        if ( dstAddress ) {
            const $dstAddress = this.page.getByLabel('Destination address');
            await $dstAddress.clear();
            await $dstAddress.fill(dstAddress);
        }

        if ( messageId ) {
            const $messageId = this.page.getByLabel('Message ID');
            await $messageId.clear();
            await $messageId.fill(messageId);
        }
    }

    async buildFrame () {
        await this.page.getByRole('button', {name: 'Build frame'}).click();
    }

    async chooseUplinkDirection () {
        await this.page.getByLabel('uplink').click();
    }

    async chooseBase64 () {
        await this.page.getByLabel('base64').click();
    }

    async getAllTitleTexts () {
        return await this.page.locator('h5').allInnerTexts();
    }

    async getAllDescriptionTexts () {
        return await this.page.locator('p').allInnerTexts();
    }
}
