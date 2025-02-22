import { hashPassword, comparePassword } from "../src/utils/hasher";

describe("Hasher Utility Functions", () => {
  const password: string = "password";
  const incorrectPassword: string = "isNotCorrect";
  let hashedPassword: string = "";

  beforeEach(async () => {
    hashedPassword = await hashPassword(password);
  });

  it("should hash password correctly", async () => {
    expect(hashedPassword).not.toBe(password);
  });

  it("should compare password correctly", async () => {
    const result = await comparePassword(password, hashedPassword);
    expect(result).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const result = await comparePassword(incorrectPassword, hashedPassword);
    expect(result).toBe(false);
  });
});
