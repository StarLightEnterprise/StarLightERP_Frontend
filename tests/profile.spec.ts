import { test, expect } from '@playwright/test';

test.describe('Profile', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/\/dashboard/);

        await page.getByRole('button', { name: /User/ }).click();
        await page.getByRole('link', { name: 'Profile' }).click();
    });

    test('should display user profile information', async ({ page }) => {
        await expect(page.getByLabel('Name')).toHaveValue('Admin User'); // Assuming mock data
        await expect(page.getByLabel('Email')).toHaveValue('admin@starlighterp.com');
    });

    test('should allow updating profile', async ({ page }) => {
        await page.getByLabel('Name').fill('Updated Name');
        await page.getByRole('button', { name: 'Save Changes' }).click();

        await expect(page.locator('.message.success')).toBeVisible();
        await expect(page.getByLabel('Name')).toHaveValue('Updated Name');
    });
});
