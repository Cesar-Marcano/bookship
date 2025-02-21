import request from "supertest";
import { app } from "../../src/app";

describe("E2E Tests", () => {
  it("should create a new book", async () => {
    const newBook = { title: "New Book", author: "Author Name" };
    const res = await request(app).post("/api/books").send(newBook);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newBook.title);
  });
});
