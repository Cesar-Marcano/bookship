import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";

export const getBookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const book = await bookService.getBook(
      parseInt(req.params["id"] as string)
    );

    res.status(200).json(book);

    return;
  } catch (error) {
    next(error);

    return;
  }
};
