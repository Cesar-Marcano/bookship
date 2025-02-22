import { BadRequestError } from "../errors/badRequest.error";
import { DuplicateKeyError } from "../errors/duplicateKey.error";
import {
  User,
  UserRepository,
  UserWihtoutPassword,
} from "../repositories/user.repository";
import { hashPassword } from "../utils/hasher";
import { Service } from "../utils/service";

export class UserService extends Service {
  constructor(public readonly userRepository: UserRepository) {
    super();
  }

  /**
   * Creates a new user and returns the newly created user object.
   *
   * @param user The user object to create.
   * @returns The newly created user object.
   *
   * @throws {BadRequestError} If the user with the given email already exists.
   */
  public async createUser(user: User): Promise<UserWihtoutPassword> {
    try {
      const password = await hashPassword(user.password);

      return this.userRepository.create({ ...user, password });
    } catch (error) {
      if (error instanceof DuplicateKeyError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  /**
   * Finds a user by their email and returns the user object.
   *
   * @param email The email of the user to find.
   * @returns The user object if found, otherwise null.
   *
   * @throws {NotFoundError} If the user with the given email does not exist.
   */
  public async getUserByEmail(email: string): Promise<UserWihtoutPassword> {
    return this.userRepository.findByEmail(email); // Already throws a NotFoundError exception if not found.
  }

  /**
   * Finds a user by their ID and returns the user object.
   *
   * @param id The ID of the user to find.
   * @returns The user object if found, otherwise null.
   *
   * @throws {NotFoundError} If the user with the given ID does not exist.
   */
  public async getUserById(id: number): Promise<UserWihtoutPassword> {
    return this.userRepository.findById(id); // Already throws a NotFoundError exception if not found.
  }

  /**
   * Updates a user by their ID and returns the updated user object.
   *
   * @param id The ID of the user to update.
   * @param user The user object with the updated values.
   * @returns The updated user object.
   *
   * @throws {NotFoundError} If the user with the given ID does not exist.
   */
  public async updateUserById(
    id: number,
    user: Partial<User>
  ): Promise<UserWihtoutPassword> {
    const newUserInfo = {
      ...user,
      ...(user.password && { password: await hashPassword(user.password) }),
    };
    return this.userRepository.updateUserById(id, newUserInfo); // Already throws a NotFoundError exception if not found.
  }

  /**
   * Deletes a user by their ID and returns the deleted user object.
   *
   * @param id The ID of the user to delete.
   * @returns The deleted user object.
   *
   * @throws {NotFoundError} If the user with the given ID does not exist.
   */

  public async deleteUserById(id: number): Promise<UserWihtoutPassword> {
    return this.userRepository.deleteUserById(id); // Already throws a NotFoundError exception if not found.
  }
}
