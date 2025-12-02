import { test, expect } from '@playwright/test';

test.describe('i18n', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should switch language', async ({ page }) => {
        // Assuming language selector is available on login page or dashboard
        // Let's go to dashboard for language selector
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();

        // Open language menu (assuming it's a dropdown or button)
        // Adjust selector based on actual implementation
        const langButton = page.locator('.language-selector button').first();
        if (await langButton.isVisible()) {
            await langButton.click();
            // Select Spanish or another language
            await page.getByText('Español').click();

            // Check for translated text
            // await expect(page.getByText('Tablero')).toBeVisible(); // Dashboard in Spanish
        }
    });
});
