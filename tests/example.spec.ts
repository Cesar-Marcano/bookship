import { sum } from "../src/utils";

describe("Sample Utility Functions", () => {
  it("should sum two numbers correctly", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
