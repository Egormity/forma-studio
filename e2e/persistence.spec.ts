import { expect, test } from '@playwright/test';

test('preserves an unreadable save on mount and backs it up before editing', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('forma-studio.scene.v1', '{broken'));
  await page.goto('/');
  await expect(
    page.getByRole('status').filter({ hasText: 'Previous save preserved' }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('forma-studio.scene.v1'))).toBe('{broken');
  expect(
    await page.evaluate(() => localStorage.getItem('forma-studio.scene.recovery.v1')),
  ).toBeNull();

  const width = page.getByRole('spinbutton', { name: 'Room width', exact: true });
  await width.fill('9');
  await width.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Saved on this device' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('forma-studio.scene.recovery.v1'))).toBe(
    '{broken',
  );
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('forma-studio.scene.v1')!).room.width,
    ),
  ).toBe(9);
});
