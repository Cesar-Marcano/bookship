import { v4 as uuidv4 } from "uuid";

import { executeSQLFile } from "../utils/executeSQL";

const addActiveSessionSQL = executeSQLFile("auth/addActiveSession");
const removeActiveSessionSQL = executeSQLFile("auth/removeActiveSession");

export class SessionRepository {
  async createSession(userId: number): Promise<string> {
    const uuid = uuidv4();

    await addActiveSessionSQL([userId, uuid]);

    return uuid;
  }

  async removeSession(userId: number, uuid: string): Promise<boolean> {
    await removeActiveSessionSQL([userId, uuid]);

    return true;
  }
}
