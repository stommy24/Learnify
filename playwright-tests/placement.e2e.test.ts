import { test, expect } from '@playwright/test';

test.describe('Placement Test Flow', () => {
  test('complete placement test journey', async ({ page }) => {
    // Start test
    await page.goto('/placement/start');
    await expect(page).toHaveTitle(/Placement Test/);

    // Fill initial form
    await page.fill('[name="age"]', '15');
    await page.fill('[name="gradeLevel"]', '9');
    await page.click('[name="previousExperience"]');
    await page.click('button[type="submit"]');

    // Answer questions
    for (let i = 0; i < 5; i++) {
      await expect(page.locator('.question-content')).toBeVisible();
      
      // Answer multiple choice or numeric question
      const questionType = await page.getAttribute('.question-wrapper', 'data-type');
      if (questionType === 'MULTIPLE_CHOICE') {
        await page.click('input[value="A"]');
      } else {
        await page.fill('input[type="number"]', '42');
      }
      
      await page.click('button[type="submit"]');
      await expect(page.locator('.loading-state')).toBeVisible();
    }

    // Check results
    await expect(page.locator('h2')).toHaveText('Test Results');
    await expect(page.locator('.final-level')).toBeVisible();
    await expect(page.locator('.recommendations')).toBeVisible();
  });
}); 