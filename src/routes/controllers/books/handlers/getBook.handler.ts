import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";
import { BadRequestError } from "../../../../errors/badRequest.error";

/**
 * @swagger
 * /api/books/get-book/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieves a specific book using its ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A book object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "The Great Gatsby"
 *                 author:
 *                   type: string
 *                   example: "F. Scott Fitzgerald"
 *                 description:
 *                   type: string
 *                   example: "A novel about the American dream."
 *                 genre:
 *                   type: string
 *                   example: "Fiction"
 *                 publication_year:
 *                   type: string
 *                   example: "1925"
 *                 cover_image_url:
 *                   type: string
 *                   format: uri
 *                   example: "https://example.com/cover.jpg"
 *       400:
 *         description: Bad request, invalid book ID
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
export const getBookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params["id"] as string);

    if (!id) {
      throw new BadRequestError("Invalid book id");
    }

    const book = await bookService.getBook(id);

    res.status(200).json(book);

    return;
  } catch (error) {
    next(error);

    return;
  }
};
