import { test, expect } from '@playwright/test';

test.describe('Auth Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/', { timeout: 60000 });
  });

  test('should open and close the auth modal', async ({ page }) => {
    // Open modal from signup button
    await page.getByRole('button', { name: /start tracking/i }).click();

    // Wait for the modal to be visible by checking for the close button
    await expect(page.getByRole('button', { name: /close modal/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /join hacker tracker/i })).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: /close modal/i }).click();
    await expect(page.getByRole('heading', { name: /join hacker tracker/i })).not.toBeVisible();
  });

  test('should switch between login and signup', async ({ page }) => {
    // Open modal from signup button
    await page.getByRole('button', { name: /start tracking/i }).click();

    // Wait for the modal to be visible
    await expect(page.getByRole('button', { name: /close modal/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /join hacker tracker/i })).toBeVisible();

    // Switch to login
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

    // Switch back to signup
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByRole('heading', { name: /join hacker tracker/i })).toBeVisible();
  });

  test('should open the auth modal from the login button', async ({ page }) => {
    // Open modal from login text button
    await page.getByRole('button', { name: /log in/i }).click();

    // Wait for the modal to be visible
    await expect(page.getByRole('button', { name: /close modal/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });
});
