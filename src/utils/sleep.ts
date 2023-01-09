/**
 * @description Creates a promise that resolves itself after the given number of milliseconds
 * @author John Schiltz
 * @export
 * @param ms
 * @return {*}
 */
export function sleep(ms: number) {
  // Create new promise that resolves itself after a delay of <ms>
  return new Promise((resolve: (args: void) => void) =>
    setTimeout(resolve, ms)
  );
}
