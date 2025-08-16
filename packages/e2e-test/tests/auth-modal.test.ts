import { test, expect } from '@playwright/test';

test.describe('Auth Modal', () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
    username: `testuser${Date.now()}`
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
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

  test('should successfully sign up a new user', async ({ page }) => {
    // Open signup modal
    await page.getByRole('button', { name: /start tracking/i }).click();
    
    // Wait for modal to be visible
    await expect(page.getByRole('heading', { name: /join hacker tracker/i })).toBeVisible();
    
    // Fill out signup form
    await page.getByLabel(/email address/i).fill(testUser.email);
    await page.locator('input[type="password"]').first().fill(testUser.password);
    await page.locator('input[type="password"]').nth(1).fill(testUser.password);
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Wait for success (modal should close)
    await expect(page.getByRole('heading', { name: /join hacker tracker/i })).not.toBeVisible({ timeout: 10000 });
    
    // Verify redirect to /track page
    await page.waitForURL('**/track', { timeout: 10000 });
    expect(page.url()).toContain('/track');
  });

  test('should successfully log in an existing user', async ({ page, request }) => {
    // First, create a user via API
    const loginTestUser = {
      email: `logintest${Date.now()}@example.com`,
      password: 'testpassword123',
      username: `loginuser${Date.now()}`
    };
    
    // Create user via API
    const signupResponse = await request.post('http://localhost:3051/api/auth/register', {
      data: loginTestUser
    });
    expect(signupResponse.ok()).toBeTruthy();
    
    // Now test login through UI
    await page.goto('/', { timeout: 60000 });
    
    // Open login modal
    await page.getByRole('button', { name: /log in/i }).click();
    
    // Wait for modal to be visible
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    
    // Fill out login form
    await page.getByLabel(/email address/i).fill(loginTestUser.email);
    await page.locator('input[type="password"]').fill(loginTestUser.password);
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for success (modal should close)
    await expect(page.getByRole('heading', { name: /welcome back/i })).not.toBeVisible({ timeout: 10000 });
    
    // Verify redirect to /track page
    await page.waitForURL('**/track', { timeout: 10000 });
    expect(page.url()).toContain('/track');
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    // Open signup modal
    await page.getByRole('button', { name: /start tracking/i }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
    
    // Test invalid email
    await page.getByLabel(/email address/i).fill('invalid-email');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();
    
    // Test short password
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('123');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/password must be at least 8 characters long/i)).toBeVisible();
    
    // Test password mismatch
    await page.locator('input[type="password"]').first().fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('different123');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    // Open login modal
    await page.getByRole('button', { name: /log in/i }).click();
    
    // Try to login with invalid credentials
    await page.getByLabel(/email address/i).fill('nonexistent@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 10000 });
  });
});
