import { NotFoundError } from "../errors/notFound.error";
import { executeSQLFile } from "../utils/executeSQL";

const createBookSQL = executeSQLFile("books/createBook");
const updateBookSQL = executeSQLFile("books/updateBook");
const getBookByIdSQL = executeSQLFile("books/getBookById");
const deleteBookSQL = executeSQLFile("books/deleteBook");

export interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  publication_year: string;
  createdAt: string;
  updatedAt: string;
  cover_image_url?: string;
  file_url?: string;
}

export class BookRepository {
  public async createBook(book: Book): Promise<Book> {
    const { rows } = await createBookSQL([
      book.slug,
      book.title,
      book.author,
      book.description,
      book.genre,
      book.publication_year,
      book.cover_image_url ?? null,
      book.file_url ?? null,
    ]);

    return rows[0];
  }

  public async getBook(bookId: number): Promise<Book> {
    const { rows } = await getBookByIdSQL([bookId]);

    if (!rows[0]) throw new NotFoundError("Book not found.");

    return rows[0];
  }

  public async updateBook(
    bookId: number,
    newBook: Partial<Book>
  ): Promise<Book> {
    const storedBook = await this.getBook(bookId);

    const book = {
      ...storedBook,
      ...newBook,
    };

    const { rows } = await updateBookSQL([
      bookId,
      book.slug,
      book.title,
      book.author,
      book.description,
      book.genre,
      book.publication_year,
      book.cover_image_url ?? null,
      book.file_url ?? null,
    ]);

    return rows[0];
  }

  public async deleteBook(bookId: number): Promise<boolean> {
    this.getBook(bookId);

    const { rows } = await deleteBookSQL([bookId]);

    return !!rows[0];
  }
}
