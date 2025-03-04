import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { TopMenuPage } from '../pages/topMenuPage';
import {
    BatchInfo, BrowserType,
    ClassicRunner, Configuration,
    DeviceName, Eyes, EyesRunner,
    VisualGridRunner, ScreenOrientation,
    Target
} from '@applitools/eyes-playwright';
require('dotenv').config();

const baseURL = 'https://playwright.dev/';
let homePage: HomePage;
let topMenuPage: TopMenuPage;
const pageUrl = /.*intro/;

// Applitools
// export const USE_ULTRAFAST_GRID: boolean = true;
export const USE_ULTRAFAST_GRID: boolean = false;
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
let eyes: Eyes;
// end of Applitools
test.beforeAll(async () => {

    if (USE_ULTRAFAST_GRID) {
        Runner = new VisualGridRunner({ testConcurrency: 5 });
    }
    else {
        Runner = new ClassicRunner();
    }

    const runnerName = (USE_ULTRAFAST_GRID) ? 'Ultrafast Grid' : 'Classic runner';
    Batch = new BatchInfo({ name: `Playwright website - ${runnerName}` });

    Config = new Configuration();
    const apiKey = process.env.APPLITOOLS_API_KEY;
    if (!apiKey) {
        throw new Error('No API key found; please set the APPLITOOLS_API_KEY environment variable');
    }
    Config.setApiKey(apiKey);

    Config.setBatch(Batch);
    if (USE_ULTRAFAST_GRID)  {
        Config.addBrowser(800, 600, BrowserType.CHROME);
        Config.addBrowser(1600, 1200, BrowserType.FIREFOX);
        Config.addBrowser(1024, 768, BrowserType.SAFARI);
        Config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT);
        Config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
    }
});

test.beforeEach(async ({ page }) => {
    //Applitools
    eyes = new Eyes(Runner, Config);
    await eyes.open(
        page,
        'Playwright website',
        test.info().title,
        { width: 1024, height: 768 }
    );

    await page.goto(baseURL);
    // Assertions use the expect API.
    await expect(page).toHaveURL(baseURL);
    // Create a new instance of the HomePage class
    homePage = new HomePage(page);
});


async function clickGetStarted(page: Page) {
    await homePage.clickGetStarted();
    topMenuPage = new TopMenuPage(page);
}

test.describe('Playwright website', () => {

    test('has title', async () => {
        await homePage.assertPageTitle();
        // https://applitools.com/docs/api-ref/sdk-api/playwright/js-intro/checksettings
        await eyes.check('Home page', Target.window().fully());
    });

    test('get started link', async ({ page }) => {
        await clickGetStarted(page);
        await topMenuPage.assertPageUrl(pageUrl);
        // https://applitools.com/docs/api-ref/sdk-api/playwright/js-intro/checksettings#region-match-levels
        // Layout: Check only the layout and ignore actual text and graphics.
        await eyes.check('Get Started page', Target.window().fully().layout());
    });

    test('check Java page', async ({ page }) => {
        await test.step('Act', async () => {
            await clickGetStarted(page);
            await topMenuPage.hoverLanguageDropdown();
            await topMenuPage.clickJava();
        });
        await test.step('Assert', async () => {
            await topMenuPage.assertPageUrl(pageUrl);
            await topMenuPage.assertNodeDescriptionNotVisible();
            await topMenuPage.assertJavaDescriptionVisible();
            // https://applitools.com/docs/api-ref/sdk-api/playwright/js-intro/checksettings#region-match-levels
            // Ignore colors: Similar to the strict match level but ignores changes in colors.
            await eyes.check('Java page', Target.window().fully().ignoreColors());
        });
    });
});

test.afterEach(async () => {
    await eyes.close();
});

test.afterAll(async () => {
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results);
});