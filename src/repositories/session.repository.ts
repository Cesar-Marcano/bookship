import { v4 as uuidv4 } from "uuid";

import { executeSQLFile } from "../utils/executeSQL";

const addActiveSessionSQL = executeSQLFile("auth/addActiveSession");
const removeActiveSessionSQL = executeSQLFile("auth/removeActiveSession");
const getSessionsSQL = executeSQLFile("auth/getSessions");
const getActiveSessionSQL = executeSQLFile("auth/getActiveSession");
const setLastActiveInSessionSQL = executeSQLFile("auth/setLastActiveInSession");

export interface SessionType {
  id: number;
  uuid: string;
  user_ip: string;
  user_agent: string;
  expires_at: string;
  created_at: string;
}

export class SessionRepository {
  async createSession(
    userId: number,
    userIp: string,
    userAgent: string,
    expiresAt: string
  ): Promise<string> {
    const uuid = uuidv4();

    await addActiveSessionSQL([userId, uuid, userIp, userAgent, expiresAt]);

    return uuid;
  }

  async removeSession(userId: number, uuid: string): Promise<boolean> {
    const sessionExists = await this.getActiveSession(userId, uuid);

    if (!sessionExists) return false;

    await removeActiveSessionSQL([userId, uuid]);

    return true;
  }

  async getSessions(userId: number): Promise<SessionType[]> {
    const { rows } = await getSessionsSQL([userId]);

    return rows || [];
  }

  async getActiveSession(
    userId: number,
    uuid: string
  ): Promise<SessionType | null> {
    const { rows } = await getActiveSessionSQL([userId, uuid]);

    return rows[0] ? rows[0] : null;
  }

  async setLastActiveInSession(uuid: string): Promise<void> {
    await setLastActiveInSessionSQL([uuid]);
  }
}
