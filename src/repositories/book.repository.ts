import { executeSQLFile } from "../utils/executeSQL";

const createBookSQL = executeSQLFile("books/createBook");

export interface Book {
  id: number;
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
}
