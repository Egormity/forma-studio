export const runtimePort = (value: string | undefined): number | undefined => {
  const configured = value?.trim();
  if (!configured) return undefined;
  const port = Number(configured);
  if (!/^\d+$/.test(configured) || !Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  return port;
};
