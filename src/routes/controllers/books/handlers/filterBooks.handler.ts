import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";

/**
 * @swagger
 * /api/books/filter:
 *   get:
 *     summary: Filter books
 *     description: Retrieves a list of books based on optional filters like genre and author.
 *     tags:
 *       - Books
 *     parameters:
 *       - name: genre
 *         in: query
 *         required: false
 *         description: The genre of the books to filter
 *         schema:
 *           type: string
 *           example: "Fiction"
 *       - name: author
 *         in: query
 *         required: false
 *         description: The author of the books to filter
 *         schema:
 *           type: string
 *           example: "F. Scott Fitzgerald"
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The number of books to return (default is 10)
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: offset
 *         in: query
 *         required: false
 *         description: The number of books to skip before starting to collect the result set
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: A list of filtered books
 *       400:
 *         description: Bad request, invalid query parameters
 *       500:
 *         description: Internal server error
 */
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
