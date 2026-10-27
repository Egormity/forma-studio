import { expect, test } from '@playwright/test';

test('selects and drags furniture on the canvas, restores boundary drops, and stops rendering at rest', async ({ page }) => {
  await page.addInitScript(() => {
    const tracked = window as unknown as { formaClearCount: number };
    tracked.formaClearCount = 0;
    const original = WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear = function (mask: number) {
      tracked.formaClearCount++;
      return original.call(this, mask);
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Top', exact: true }).click();
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(700);
  const area = (await canvas.boundingBox())!;
  const point = (x: number, y: number) => ({ x: area.x + x, y: area.y + y });
  const sofaPosition = () => page.evaluate(() => JSON.parse(localStorage.getItem('forma-studio.scene.v1')!).furniture[0].position as [number, number]);

  // Screen coordinates select the starter sofa in the fixed 1600×1060 top view.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await page.mouse.click(point(343, 325).x, point(343, 325).y);
  await expect(page.getByRole('textbox', { name: 'Object name' })).toHaveValue('Sofa');
  await page.getByRole('button', { name: 'Move selected object', exact: true }).click();
  const arrow = point(414, 325);
  await page.mouse.move(arrow.x, arrow.y);
  await page.mouse.down();
  await page.mouse.move(arrow.x + 80, arrow.y, { steps: 12 });
  expect(await sofaPosition()).toEqual([-2, -0.7]); // A drag commits once, on release.
  await page.mouse.up();
  await expect.poll(async () => (await sofaPosition())[0]).toBe(-0.75);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  expect(await sofaPosition()).toEqual([-2, -0.7]);

  const xField = page.getByRole('spinbutton', { name: 'Object X position', exact: true });
  await xField.fill('100');
  await xField.press('Enter');
  await expect(xField).toHaveValue('2.65');
  await page.mouse.move(20, 100);
  await page.waitForTimeout(200);
  const atBoundary = await canvas.screenshot();
  const edgeArrow = point(689, 325);
  await page.mouse.move(edgeArrow.x, edgeArrow.y);
  await page.mouse.down();
  await page.mouse.move(edgeArrow.x + 100, edgeArrow.y, { steps: 12 });
  expect((await canvas.screenshot()).equals(atBoundary)).toBe(false);
  await page.mouse.up();
  await page.mouse.move(20, 100);
  await page.waitForTimeout(400);
  expect(await sofaPosition()).toEqual([2.65, -0.7]);
  expect((await canvas.screenshot()).equals(atBoundary)).toBe(true);

  // Cancel an in-progress drag, then verify Orbit works again.
  await page.mouse.move(edgeArrow.x, edgeArrow.y);
  await page.mouse.down();
  await page.mouse.move(edgeArrow.x - 60, edgeArrow.y, { steps: 8 });
  await page.keyboard.press('Escape');
  await page.mouse.up();
  expect(await sofaPosition()).toEqual([2.65, -0.7]);
  await page.getByRole('button', { name: 'Perspective', exact: true }).click();
  await page.waitForTimeout(300);
  const beforeOrbit = await canvas.screenshot();
  await page.mouse.move(area.x + area.width * 0.8, area.y + area.height * 0.8);
  await page.mouse.down();
  await page.mouse.move(area.x + area.width * 0.65, area.y + area.height * 0.75, { steps: 12 });
  await page.mouse.up();
  await page.mouse.move(20, 100);
  await page.waitForTimeout(2500);
  expect((await canvas.screenshot()).equals(beforeOrbit)).toBe(false);
  const count = () => page.evaluate(() => (window as unknown as { formaClearCount: number }).formaClearCount);
  expect(await count()).toBeGreaterThan(0);
  // Software WebGL can take longer to finish the camera's damping frames.
  await expect.poll(async () => {
    const before = await count();
    await page.waitForTimeout(600);
    return (await count()) - before;
  }, { timeout: 10_000 }).toBe(0);
});
