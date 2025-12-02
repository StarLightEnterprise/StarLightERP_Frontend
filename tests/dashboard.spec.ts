import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Mock login state or perform login
        await page.goto('/login');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should display dashboard layout correctly', async ({ page }) => {
        await expect(page.locator('.top-bar')).toBeVisible();
        await expect(page.locator('.brand-text')).toHaveText('StarLightERP');
        await expect(page.locator('.breadcrumb-nav')).toBeVisible();
    });

    test('should navigate to profile and update breadcrumbs', async ({ page }) => {
        await page.getByRole('button', { name: /User/ }).click();
        await page.getByRole('link', { name: 'Profile' }).click();

        await expect(page).toHaveURL(/\/dashboard\/profile/);

        // Check Breadcrumb
        const breadcrumb = page.locator('.breadcrumb-nav');
        await expect(breadcrumb).toContainText('Dashboard');
        await expect(breadcrumb).toContainText('Profile');
    });

    test('should navigate to settings and update breadcrumbs', async ({ page }) => {
        await page.getByRole('button', { name: /User/ }).click();
        await page.getByRole('link', { name: 'Settings' }).click();

        await expect(page).toHaveURL(/\/dashboard\/settings/);

        // Check Breadcrumb
        const breadcrumb = page.locator('.breadcrumb-nav');
        await expect(breadcrumb).toContainText('Dashboard');
        await expect(breadcrumb).toContainText('Settings');
    });
});
