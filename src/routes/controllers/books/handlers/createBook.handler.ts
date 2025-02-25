import { NextFunction, Response } from "express";
import { bookService } from "../../../../services";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { getUser } from "../../../../utils/getUser";
import { CreateBookDto } from "../../../../dto/books/createBook.dto";

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     description: Creates a new book associated with the authenticated user.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookDto'
 *     responses:
 *       201:
 *         description: Book successfully created
 *       400:
 *         description: Bad request, invalid data
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
export const createBookHandler = async (
  req: HydratedRequest<CreateBookDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = getUser(req);
    const book = await bookService.createBook(req.body, user.userData.id!);

    res.status(201).json(book);

    return;
  } catch (error) {
    next(error);

    return;
  }
};
