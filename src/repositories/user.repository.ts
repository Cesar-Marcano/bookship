import { executeSQLFile } from "../utils/executeSQL";

const getUserByIdSQL = executeSQLFile("/user/getUserById.sql");

interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export class UserRepository {
  /**
   * Finds a user by their ID and returns the user object.
   *
   * @param id The ID of the user to find.
   * @returns The user object if found, otherwise null.
   */
  async findById(id: number): Promise<User> {
    const { rows } = await getUserByIdSQL([id]);

    return rows[0] || null;
  }

  /**
   * Creates a new user and returns the newly created user object.
   *
   * @param user The user object to create.
   * @returns The newly created user object.
   */
  async create(user: User): Promise<User> {
    const { rows } = await executeSQLFile("/user/createUser.sql")([
      user.name,
      user.email,
      user.password,
    ]);

    return rows[0];
  }
}
