import { NextFunction, Request, Response } from "express";
import { bookService } from "../../../../services";
import { BadRequestError } from "../../../../errors/badRequest.error";

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
