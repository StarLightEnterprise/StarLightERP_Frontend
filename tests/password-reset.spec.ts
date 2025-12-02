import { test, expect } from '@playwright/test';

test.describe('Password Reset', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();

        await page.getByRole('button', { name: /User/ }).click();
        await page.getByRole('link', { name: 'Settings' }).click();
    });

    test('should validate password mismatch', async ({ page }) => {
        await page.getByLabel('Current Password').fill('password');
        await page.getByLabel('New Password').fill('newpassword123');
        await page.getByLabel('Confirm New Password').fill('mismatch');
        await page.getByRole('button', { name: 'Update Password' }).click();

        await expect(page.locator('.message.error')).toContainText('do not match');
    });

    test('should allow password update', async ({ page }) => {
        await page.getByLabel('Current Password').fill('password');
        await page.getByLabel('New Password').fill('newpassword123');
        await page.getByLabel('Confirm New Password').fill('newpassword123');
        await page.getByRole('button', { name: 'Update Password' }).click();

        await expect(page.locator('.message.success')).toBeVisible();
    });
});
