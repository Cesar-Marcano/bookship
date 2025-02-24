import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";
import { BadRequestError } from "../../../../errors/badRequest.error";

export const searchBooksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { genre, author, limit, offset, title } = req.query;

    if (!title) {
      throw new BadRequestError("Title search term is required");
    }

    const filters = {
      titleSearchTerm: title as string,
      ...(genre ? { genre: genre as string } : {}),
      ...(author ? { author: author as string } : {}),
      limit: Math.max(1, Number(limit)),
      offset: Math.max(0, Number(offset)),
    };

    const books = await bookService.searchBooks(filters);

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};
