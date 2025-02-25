import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";
import { getUser } from "../../../../utils/getUser";

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Deletes a book associated with the authenticated user.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Book successfully deleted
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
export const deleteBookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = getUser(req);

    const book = await bookService.deleteBook(
      parseInt(req.params["id"] as string),
      user.userData.id!,
      user.userData.role!
    );

    res.status(200).json(book);

    return;
  } catch (error) {
    next(error);

    return;
  }
};
