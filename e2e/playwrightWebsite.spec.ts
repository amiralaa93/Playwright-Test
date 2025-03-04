import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { TopMenuPage } from '../pages/topMenuPage';

const baseURL = 'https://playwright.dev';
let homePage: HomePage;
let topMenuPage: TopMenuPage;
const pageUrl = /.*intro/;

test.describe('Playwright website', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto(baseURL);
    // Assertions use the expect API.
    await expect(page).toHaveURL(baseURL);
    // Create a new instance of the HomePage class
    homePage = new HomePage(page);
  });

  async function clickGetStarted(page: Page) {
    // Click the get started link.
    await homePage.clickGetStarted();
    topMenuPage = new TopMenuPage(page);
  }

  test('has title', async () => {
    // Expect a title "to contain" a substring.
    await homePage.assertPageTitle();
  });

  test('get started link', async ({ page }) => {
    // Click the get started link.
    await clickGetStarted(page);
    // Expects the url to contain the intro.
    await topMenuPage.assertPageUrl(pageUrl);
    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('check Java language', async ({ page }) => {
    await test.step('Act', async () => {
      // Click the get started link.
      await clickGetStarted(page);
      // Mouse hover over the language dropdown.
      await topMenuPage.hoverLanguageDropdown();
      // Click the Java language.
      await topMenuPage.clickJava();
    });

    await test.step('Assert', async () => {
      // Expects page to have a heading with the name of Java.
      await topMenuPage.assertPageUrl(pageUrl);
      // Expects Installing Playwright Node Description not visible.
      await topMenuPage.assertNodeDescriptionNotVisible();
      // Expects the page to have a text with the name of JavaDescription.
      await topMenuPage.assertJavaDescriptionVisible();
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus)
      console.log(`Did not run as expected, ended up at ${page.url()}`);
    // clean up all the data we created for this test through API calls
  });
});