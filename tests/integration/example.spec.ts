import request from "supertest";
import { app } from "../../src/app";

describe("GET /api/books", () => {
  it("should return a list of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
