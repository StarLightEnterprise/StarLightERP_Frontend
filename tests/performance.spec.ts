import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
    test('should load login page within acceptable time', async ({ page }) => {
        const start = Date.now();
        await page.goto('/login');
        const end = Date.now();
        const duration = end - start;

        console.log(`Login page load time: ${duration}ms`);
        expect(duration).toBeLessThan(2000); // Expect under 2s

        // Check LCP (Largest Contentful Paint)
        const lcp = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.startTime);
                }).observe({
                    type: 'largest-contentful-paint',
                    buffered: true
                });
            });
        });
        console.log(`LCP: ${lcp}ms`);
        expect(lcp).toBeLessThan(2500);
    });

    test('should navigate between pages quickly', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/\/dashboard/);

        const start = Date.now();
        await page.getByRole('button', { name: /User/ }).click();
        await page.getByRole('link', { name: 'Profile' }).click();
        await expect(page).toHaveURL(/\/dashboard\/profile/);
        const end = Date.now();

        const duration = end - start;
        console.log(`Navigation to Profile took: ${duration}ms`);
        expect(duration).toBeLessThan(1000); // SPA navigation should be fast
    });
});
