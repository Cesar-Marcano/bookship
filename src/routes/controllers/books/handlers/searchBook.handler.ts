import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";
import { BadRequestError } from "../../../../errors/badRequest.error";

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search for books
 *     description: Retrieves a list of books based on search criteria such as title, genre, and author.
 *     tags:
 *       - Books
 *     parameters:
 *       - name: title
 *         in: query
 *         required: true
 *         description: The title search term to filter books
 *         schema:
 *           type: string
 *           example: "The Great Gatsby"
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
 *         description: A list of books matching the search criteria
 *       400:
 *         description: Bad request, title search term is required
 *       500:
 *         description: Internal server error
 */
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
