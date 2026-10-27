import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const saved = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('forma-studio.scene.v1')!));
const edit = async (page: Page, label: string, value: string) => {
  await page.getByRole('spinbutton', { name: label, exact: true }).fill(value);
  await page.getByRole('spinbutton', { name: label, exact: true }).press('Enter');
};

test('renders a real 3D scene and edits, saves, undoes, and exchanges configurations', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4400')) external.push(request.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A space to make your own.' })).toBeVisible();
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(1500);
  const originalRender = await canvas.screenshot();
  expect(originalRender.byteLength).toBeGreaterThan(20_000);

  await edit(page, 'Room width', '9');
  expect((await saved(page)).room.width).toBe(9);
  await page.getByRole('button', { name: 'Soft sage', exact: true }).click();
  await page.getByRole('button', { name: 'Smoked walnut', exact: true }).click();
  expect((await saved(page)).room).toMatchObject({ wallFinish: 'sage', floorFinish: 'walnut' });
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  expect((await saved(page)).room.floorFinish).toBe('oak');
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  expect((await saved(page)).room.floorFinish).toBe('walnut');

  await page.getByRole('button', { name: 'Show roof', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cutaway walls', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Cutaway walls', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Show roof', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Top', exact: true }).click();
  await page.waitForTimeout(350);
  expect((await canvas.screenshot()).equals(originalRender)).toBe(false);

  await page.getByRole('tab', { name: 'Furniture', exact: true }).click();
  await page.getByRole('button', { name: 'Add platform bed', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Object name' })).toHaveValue('Platform bed');
  expect((await saved(page)).furniture).toHaveLength(7);
  await edit(page, 'Object X position', '1.25');
  await edit(page, 'Object width', '2');
  await page.getByRole('button', { name: 'Rotate object 90 degrees' }).click();
  await page.getByRole('button', { name: 'Object colour terracotta', exact: true }).click();
  const bed = (await saved(page)).furniture.at(-1);
  expect(bed).toMatchObject({ position: [1.25, 0.5], rotation: 90, color: '#b66c50', size: { width: 2 } });

  await page.getByRole('button', { name: 'Duplicate', exact: true }).click();
  expect((await saved(page)).furniture).toHaveLength(8);
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  expect((await saved(page)).furniture).toHaveLength(7);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  expect((await saved(page)).furniture).toHaveLength(8);
  await page.getByRole('button', { name: 'Redo', exact: true }).click();

  const expected = await saved(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export scene', exact: true }).click();
  const download = await downloadPromise;
  const exported = await readFile((await download.path())!, 'utf8');
  expect(JSON.parse(exported)).toEqual(expected);
  await page.reload();
  expect(await saved(page)).toEqual(expected);
  await page.getByRole('button', { name: 'Reset space', exact: true }).click();
  expect((await saved(page)).furniture).toHaveLength(6);
  await page.getByLabel('Import scene file').setInputFiles({ name: 'saved.forma.json', mimeType: 'application/json', buffer: Buffer.from(exported) });
  await expect(page.locator('.toast[role="status"]')).toContainText('Your scene is ready');
  expect(await saved(page)).toEqual(expected);

  await page.getByLabel('Import scene file').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"version":2}') });
  await expect(page.getByRole('alert')).toContainText('not a valid Forma Studio scene');
  expect(await saved(page)).toEqual(expected);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('keeps controls usable on a narrow viewport and supports canceling edits', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const name = page.getByRole('textbox', { name: 'Object name' });
  await name.fill('');
  await name.press('Enter');
  await expect(name).toHaveValue('Sofa');
  await name.fill('Temporary name');
  await name.press('Escape');
  await expect(name).toHaveValue('Sofa');
  const width = page.getByRole('spinbutton', { name: 'Object width', exact: true });
  await width.fill('4');
  await width.press('Escape');
  await expect(width).toHaveValue('2.3');
  await page.getByRole('tab', { name: 'Furniture', exact: true }).click();
  await page.getByRole('button', { name: 'Add indoor tree', exact: true }).click();
  await expect(name).toHaveValue('Indoor tree');
  expect((await saved(page)).furniture).toHaveLength(7);
  await page.screenshot({ path: '.playwright/mobile.png', fullPage: true });
});
