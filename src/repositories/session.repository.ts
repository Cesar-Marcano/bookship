import { v4 as uuidv4 } from "uuid";

import { executeSQLFile } from "../utils/executeSQL";

const addActiveSessionSQL = executeSQLFile("auth/addActiveSession");
const removeActiveSessionSQL = executeSQLFile("auth/removeActiveSession");
const getSessionsSQL = executeSQLFile("auth/getSessions");
const getActiveSessionSQL = executeSQLFile("auth/getActiveSession");

export class SessionRepository {
  async createSession(userId: number): Promise<string> {
    const uuid = uuidv4();

    await addActiveSessionSQL([userId, uuid]);

    return uuid;
  }

  async removeSession(userId: number, uuid: string): Promise<boolean> {
    const sessionExists = await this.getActiveSession(userId, uuid);

    if (!sessionExists) return false;

    await removeActiveSessionSQL([userId, uuid]);

    return true;
  }

  async getSessions(userId: number): Promise<string[]> {
    const { rows } = await getSessionsSQL([userId]);

    return rows[0]?.active_sessions || [];
  }

  async getActiveSession(userId: number, uuid: string): Promise<string | null> {
    const { rows } = await getActiveSessionSQL([userId, uuid]);

    return rows[0]?.id ? uuid : null;
  }
}
