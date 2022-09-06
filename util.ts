export function sleep(ms: number) {
  // Create new promise that resolves itself after a delay of <ms>
  return new Promise((resolve: (args: void) => void) =>
    setTimeout(resolve, ms)
  );
}
