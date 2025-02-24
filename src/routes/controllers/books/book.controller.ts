import { Router } from "express";
import { hasRole } from "../../../middleware/authMiddleware";
import { Role } from "../../../types/role";
import { createBookHandler } from "./handlers/createBook.handler";
import { getBookHandler } from "./handlers/getBook.handler";
import { bodyValidator } from "../../../middleware/bodyValidator";
import { CreateBookDto } from "../../../dto/books/createBook.dto";
import { UpdateBookDto } from "../../../dto/books/updateBook.dto";
import { updateBookHandler } from "./handlers/updateBook.handler";
import { deleteBookHandler } from "./handlers/deleteBook.handler";
import { filterBooksHandler } from "./handlers/filterBooks.handler";
import { searchBooksHandler } from "./handlers/searchBook.handler";

export const bookController = Router();

bookController.post(
  "/",
  hasRole([Role.Creator, Role.Admin, Role.Moderator]),
  bodyValidator(CreateBookDto),
  createBookHandler
);

bookController.get("/get-book/:id", getBookHandler);

bookController.put(
  "/:id",
  hasRole([Role.Creator, Role.Admin, Role.Moderator]),
  bodyValidator(UpdateBookDto),
  updateBookHandler
);

bookController.delete(
  "/:id",
  hasRole([Role.Creator, Role.Admin, Role.Moderator]),
  deleteBookHandler
);

bookController.get("/filter", filterBooksHandler);

bookController.get("/search", searchBooksHandler);
