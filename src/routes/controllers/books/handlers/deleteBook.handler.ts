import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";
import { getUser } from "../../../../utils/getUser";

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
