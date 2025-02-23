import { NextFunction, Response } from "express";
import { bookService } from "../../../../services";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { getUser } from "../../../../utils/getUser";
import { UpdateBookDto } from "../../../../dto/books/updateBook.dto";

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
