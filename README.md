# Playwright Test Automation with GitHub Actions

## 📌 Overview
This project uses **Playwright** for end-to-end (E2E) testing, with **GitHub Actions** for CI/CD, **parallel execution**, and **email notifications** for test failures.

---

## 🚀 Setup Instructions

### **1️⃣ Install Playwright**
Run the following command to initialize Playwright:

```sh
npm init playwright@latest
```

This will:
- Install **Playwright Test**
- Set up a **playwright.config.ts** file
- Add sample tests


### **2️⃣ Running Tests Locally**
To execute all tests:
```sh
npx playwright test
```

To run tests in **headed mode** (visible browser):
```sh
npx playwright test --headed
```

To run tests in **parallel** (default behavior):
```sh
npx playwright test --workers=4
```

---

## 🔧 Configuration (playwright.config.ts)
Modify `playwright.config.ts` to enable reporting and parallel execution:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    browserName: 'chromium',  // Options: chromium, firefox, webkit
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [['html', { open: 'never' }]],  // Enables HTML reports
  workers: 4,  // Runs 4 tests in parallel
});
```

---

## 📩 Email Notifications for Test Failures
This setup sends **email notifications** if tests fail using **SMTP (Gmail, Outlook, etc.)**.

### **1️⃣ Configure SMTP Credentials in GitHub Secrets**
Go to **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**, and add:
- `SMTP_SERVER` → e.g., `smtp.gmail.com`
- `SMTP_PORT` → `587`
- `EMAIL_USERNAME` → Your email (e.g., `your-email@gmail.com`)
- `EMAIL_PASSWORD` → **App Password** (not your regular password)

> **For Gmail**: Generate an [App Password](https://myaccount.google.com/apppasswords)


### **2️⃣ GitHub Actions Workflow** (`.github/workflows/playwright.yml`)

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - name: Upload Playwright HTML Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report  # Uploads the test report
      - name: Zip Playwright Report
        if: failure()
        run: zip -r playwright-report.zip playwright-report/
      - name: Send Email Notification on Failure
        if: failure()
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: ${{ secrets.SMTP_SERVER }}
          server_port: ${{ secrets.SMTP_PORT }}
          username: ${{ secrets.EMAIL_USERNAME }}
          password: ${{ secrets.EMAIL_PASSWORD }}
          subject: "🚨 Playwright Test Failed"
          body: "Some Playwright tests failed. Check the attached report."
          to: "recipient1@example.com, recipient2@example.com"
          from: "your-email@gmail.com"
          attachments: "playwright-report.zip"
```

---

## 📊 Viewing Test Reports
After tests run, an **HTML report** is generated. To view it:
```sh
npx playwright show-report
```
In GitHub Actions, download the **playwright-report.zip** artifact from the workflow run.

---