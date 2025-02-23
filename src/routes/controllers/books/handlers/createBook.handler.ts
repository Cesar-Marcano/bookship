import { NextFunction, Response } from "express";
import { bookService } from "../../../../services";
import { HydratedRequest } from "../../../../middleware/bodyValidator";
import { getUser } from "../../../../utils/getUser";
import { CreateBookDto } from "../../../../dto/books/createBook.dto";

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
