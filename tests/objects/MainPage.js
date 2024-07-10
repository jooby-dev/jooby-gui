import fixture from '../fixtures/main.js';


export class MainPage {
    constructor ( page ) {
        this.page = page;
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
            : await this.page.locator('#root').click();

        return options;
    }

    async selectHardwareType ( type ) {
        await this.page.getByLabel(fixture.hardwareType.label).click();
        await this.page.getByText(type).click();
    }

    async parseDump ( dump ) {
        await this.page.getByLabel(fixture.parseMessages.dump.label, {exact: true}).fill(dump);
        await this.page.getByTestId(fixture.parseMessages.parseButton).click();
    }

    async expandLogs () {
        await this.page.getByLabel(fixture.logs.buttons.expandLogs).click();
        await this.page.waitForTimeout(2000);
    }

    async createMessage ( command, direction ) {
        await this.page.getByLabel('Command', {exact: true}).click();

        const option = direction === 'downlink'
            ? await this.page.getByRole('option', {name: command.name, exact: true}).first()
            : await this.page.getByRole('option', {name: command.name, exact: true}).last();

       // await option.scrollIntoViewIfNeeded();
        await option.click();

        if (command.parameters) {
            const textarea = await this.page.$('textarea.ace_text-input');
            await textarea.fill(JSON.stringify(command.parameters));
        }

        await this.page.getByTestId('add-command-button').click();
    }

    async buildMessage () {
        await this.page.getByRole('button', { name: 'Build message' }).click()
    }

    formatDump ( dump ) {
        return dump.replace(/(.{2})/g, '$1 ').trim();
    }
}
