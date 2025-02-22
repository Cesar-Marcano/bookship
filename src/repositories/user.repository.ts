import { NotFoundError } from "../errors/notFound.error";
import { executeSQLFile } from "../utils/executeSQL";

const getAllUserDataSQL = executeSQLFile("/user/getAllUserData.sql");
const getUserByIdSQL = executeSQLFile("/user/getUserById.sql");
const createUserSQL = executeSQLFile("/user/createUser.sql");
const getUserByEmailSQL = executeSQLFile("/user/getUserByEmail.sql");
const updateUserSQL = executeSQLFile("/user/updateUser.sql");
const deleteUserSQL = executeSQLFile("/user/deleteUser.sql");

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export type UserWihtoutPassword = Omit<User, "password">;

export class UserRepository {
  /**
   * Finds a user by their ID and returns the user object.
   *
   * @param id The ID of the user to find.
   * @returns The user object if found, otherwise null.
   */
  async findById(id: number): Promise<UserWihtoutPassword> {
    const { rows } = await getUserByIdSQL([id]);

    return rows[0] || null;
  }

  /**
   * Creates a new user and returns the newly created user object.
   *
   * @param user The user object to create.
   * @returns The newly created user object.
   */
  async create(user: User): Promise<UserWihtoutPassword> {
    const { rows } = await createUserSQL([
      user.name,
      user.email,
      user.password,
    ]);

    return rows[0];
  }

  /**
   * Finds a user by their email and returns the user object.
   *
   * @param email The email of the user to find.
   * @returns The user object if found, otherwise null.
   */
  async findByEmail(email: string): Promise<UserWihtoutPassword> {
    const { rows } = await getUserByEmailSQL([email]);

    return rows[0] || null;
  }

  /**
   *
   * @param id The ID of the user to update.
   * @param user The user object with the updated values.
   * @returns The updated user object.
   *
   * @throws {NotFoundError} If the user with the given ID does not exist.
   */
  async updateUserById(id: number, user: Partial<User>): Promise<UserWihtoutPassword> {
    const { rows } = await getAllUserDataSQL([id]);

    if (!rows[0]) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = {
      ...rows[0],
      ...user,
    };

    const { rows: updatedRows } = await updateUserSQL([
      id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
    ]);

    return updatedRows[0];
  }

  /**
   * Deletes a user by their ID and returns the deleted user object.
   *
   * @param id The ID of the user to delete.
   * @returns The deleted user object.
   *
   * @throws {NotFoundError} If the user with the given ID does not exist.
   */

  async deleteUserById(id: number): Promise<UserWihtoutPassword> {
    const { rows } = await getUserByIdSQL([id]);

    if (!rows[0]) {
      throw new NotFoundError("User not found");
    }

    const { rows: deletedRows } = await deleteUserSQL([id]);

    return deletedRows[0];
  }
}
