import { Locator, expect, Page } from "@playwright/test";

export class TopMenuPage {
    
    //Variables
    readonly page: Page;
    readonly languageDropdown: Locator;
    readonly javaLink: Locator;
    readonly nodeLable: Locator;
    readonly nodeDescription: string = 'Installing Playwright';
    readonly javaLabel: Locator;
    readonly javaDescription: string = `Playwright is distributed as a set of Maven modules. The easiest way to use it is to add one dependency to your project's pom.xml as described below. If you're not familiar with Maven please refer to its documentation.`;

    //Constructor
    constructor(page:Page){
        this.page = page;
        this.languageDropdown = page.getByRole('button', { name: 'Node.js' });
        this.javaLink = page.getByText('Java', { exact: true });
        this.nodeLable = page.getByText(this.nodeDescription, { exact: true });
        this.javaLabel = page.getByText(this.javaDescription, { exact: true });
    }

    //Methods
    async hoverLanguageDropdown(){
        await this.languageDropdown.hover();
    }

    async clickJava(){
        await this.javaLink.click();
    }

    async assertPageUrl(pageUrl: RegExp) {
        await expect(this.page).toHaveURL(pageUrl), { timeout: 5000 };
    }

    async assertJavaDescriptionVisible() {
        await expect(this.javaLabel).toBeVisible();
    }

    async assertNodeDescriptionNotVisible() {
        await expect(this.nodeLable).not.toBeVisible();
    }

}

export default TopMenuPage;