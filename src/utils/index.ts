export const sum = (...numbers: number[]): number =>
  numbers.reduce((a: number, b: number) => a + b, 0);
