import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";

export const filterBooksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { genre, author, limit, offset } = req.query;

    const filters = {
      ...(genre ? { genre: genre as string } : {}),
      ...(author ? { author: author as string } : {}),
      limit: Math.max(1, Number(limit)),
      offset: Math.max(0, Number(offset)),
    };

    const books = await bookService.filterBooks(filters);

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};
