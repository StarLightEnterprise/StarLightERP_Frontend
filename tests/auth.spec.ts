import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should allow user to login', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();

        // Expect to be redirected to dashboard
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByText('Welcome back')).toBeVisible();
    });

    test('should show error on invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Username').fill('wronguser');
        await page.getByLabel('Password').fill('wrongpass');
        await page.getByRole('button', { name: 'Sign In' }).click();

        await expect(page.locator('.message.error')).toBeVisible();
    });

    test('should allow user to logout', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/\/dashboard/);

        // Logout
        await page.getByRole('button', { name: /User/ }).click(); // Open user menu
        await page.getByRole('button', { name: 'Sign Out' }).click();

        await expect(page).toHaveURL(/\/login/);
    });
});
