import fixture from '../fixtures/main.js';


export class Main {
    constructor (page) {
        this.page = page;
    }

    async getAllSelectOption (selectId, codecSelect = false) {
        await this.page.click(selectId);

        const optionElements = await this.page.locator('li[role="option"]').all();
        const options = [];

        for (const optionElement of optionElements) {
            const optionText = await optionElement.textContent();
            options.push(optionText.trim());
        }

        //missile click for closing select list
        codecSelect
            ? await this.page.getByRole('option', { name: 'analog' }).click()
            : await this.page.locator('#root').click();

        return options;
    }

    async chooseInDropdown (option) {
        this.page.getByRole('option', { name: option, exact: true }).click();
    }

    async test () {
        const options = [];

        await this.page.click(fixture.codecType.id);

    }
}
