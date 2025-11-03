import { test, expect } from '@playwright/test';

test('upload image to Shubox demo - test accept() callback', async ({ page }) => {
  // Navigate to demo page
  await page.goto('http://localhost:8888/demo/index.html');

  // Wait for the avatar element to be loaded
  await page.waitForSelector('#avatar', { timeout: 10000 });

  // Wait a bit for Shubox to fully initialize Dropzone
  await page.waitForTimeout(1000);

  // Path to test file
  const filePath = '/Users/joel/Development/shubox.js/tmp/huh.jpg';

  // Set up a file chooser listener before triggering the click
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('#avatar'),
  ]);

  await fileChooser.setFiles(filePath);

  // Wait for upload to complete (look for success state on #avatar)
  await page.waitForSelector('#avatar.shubox-success', { timeout: 30000 });

  // Verify success
  const hasSuccessClass = await page.locator('#avatar.shubox-success').count();
  expect(hasSuccessClass).toBeGreaterThan(0);

  // Verify no error class present
  const hasErrorClass = await page.locator('#avatar.shubox-error').count();
  expect(hasErrorClass).toBe(0);

  // Verify image was uploaded and displayed
  const uploadedImage = await page.locator('#avatar img').count();
  expect(uploadedImage).toBeGreaterThan(0);

  console.log('✅ Upload test passed - accept() callback working correctly');
});
