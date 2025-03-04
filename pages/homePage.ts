import { expect, Locator, Page } from '@playwright/test';

export class HomePage {

    //Variables are usually readonly
    readonly page: Page;
    readonly getStartedButton: Locator;
    readonly title: RegExp;

    //Constructor
    constructor (page: Page){
        this.page = page;
        this.getStartedButton = page.getByRole('link', { name: 'Get started' });
        this.title = /Playwright/;
    }

    //Methods
    async clickGetStarted() {
        await this.getStartedButton.click();
    }

    async assertPageTitle() {
        await expect(this.page).toHaveTitle(this.title);
    }
}

export default HomePage;