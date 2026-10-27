import { afterEach, describe, expect, it, vi } from 'vitest';
import configuration from '../vite.config';
import { runtimePort } from './runtime-config';

afterEach(() => vi.unstubAllEnvs());

describe('Amazi runtime ports', () => {
  it('uses the injected port for both preview and development', async () => {
    vi.stubEnv('PORT', '10000');
    const config = await configuration({ command: 'serve', mode: 'development' });
    expect(config.server).toMatchObject({ host: '0.0.0.0', port: 10000, strictPort: true });
    expect(config.preview).toMatchObject({ host: '0.0.0.0', port: 10000, strictPort: true });
  });

  it('retains separate local ports when PORT is absent', async () => {
    vi.stubEnv('PORT', '');
    const config = await configuration({ command: 'serve', mode: 'development' });
    expect(config.server?.port).toBe(4398);
    expect(config.preview?.port).toBe(4399);
  });

  it('rejects invalid or out-of-range runtime ports', () => {
    for (const value of ['0', '-1', '65536', '10000.5', 'ten', '1e4']) {
      expect(() => runtimePort(value)).toThrow('PORT must be an integer');
    }
  });
});
