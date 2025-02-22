import { SessionRepository } from "./session.repository";
import { UserRepository } from "./user.repository";

export const userRepository = new UserRepository();

export const sessionRepository = new SessionRepository();
