import { NextFunction, Response } from "express";
import { bookService } from "../../../../services";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { getUser } from "../../../../utils/getUser";
import { UpdateBookDto } from "../../../../dto/books/updateBook.dto";

/**
 * @swagger
 * /api/books/update:
 *   put:
 *     summary: Update a book
 *     description: Updates an existing book associated with the authenticated user.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookDto'
 *     responses:
 *       200:
 *         description: Book successfully updated
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
 *         description: Bad request, invalid data
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
export const updateBookHandler = async (
  req: HydratedRequest<UpdateBookDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = getUser(req);

    const book = await bookService.updateBook(
      req.body,
      user.userData.id!,
      user.userData.role!
    );

    res.status(201).json(book);

    return;
  } catch (error) {
    next(error);

    return;
  }
};
