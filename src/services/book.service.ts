import { CreateBookDto } from "../dto/books/createBook.dto";
import { UpdateBookDto } from "../dto/books/updateBook.dto";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { Book, BookRepository } from "../repositories/book.repository";
import { Role } from "../types/role";
import { Service } from "../utils/service";

export class BookService extends Service {
  constructor(private readonly bookRepository: BookRepository) {
    super();
  }

  public async createBook(
    bookInfo: CreateBookDto,
    userId: number
  ): Promise<Book> {
    const newBook = await this.bookRepository.createBook({
      ...bookInfo,
      added_by: userId,
    });

    return newBook;
  }

  public async getBook(bookId: number): Promise<Book> {
    const book = await this.bookRepository.getBook(bookId);

    return book;
  }

  public async updateBook(
    { id: bookId, ...bookInfo }: UpdateBookDto,
    userId: number,
    userRole: Role
  ): Promise<Book> {
    const book = await this.getBook(bookId);

    if (book.added_by !== userId || userRole !== Role.Admin)
      throw new UnauthorizedError(
        "You must be the author of this book to perform this action."
      );

    const updatedBook = await this.bookRepository.updateBook(bookId, bookInfo);

    return updatedBook;
  }

  public async deleteBook(
    bookId: number,
    userId: number,
    userRole: Role
  ): Promise<boolean> {
    const book = await this.getBook(bookId);

    if (
      book.added_by !== userId ||
      (userRole !== Role.Admin && userRole !== Role.Moderator)
    )
      throw new UnauthorizedError(
        "You must be the author of this book to perform this action."
      );

    const deleted = await this.bookRepository.deleteBook(bookId);

    return deleted;
  }

  public async filterBooks(params: {
    genre?: string;
    author?: string;
    limit: number;
    offset: number;
  }): Promise<Book[]> {
    const books = await this.bookRepository.filterBooks(params);

    return books;
  }

  public async searchBooks(params: {
    titleSearchTerm: string;
    genre?: string;
    author?: string;
    limit: number;
    offset: number;
  }): Promise<Book[]> {
    const books = await this.bookRepository.searchBooks(params);

    return books;
  }
}
