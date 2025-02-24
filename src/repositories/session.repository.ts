import { v4 as uuidv4 } from "uuid";

import { executeSQLFile } from "../utils/executeSQL";

const addActiveSessionSQL = executeSQLFile("auth/addActiveSession");
const removeActiveSessionSQL = executeSQLFile("auth/removeActiveSession");
const getSessionsSQL = executeSQLFile("auth/getSessions");
const getActiveSessionSQL = executeSQLFile("auth/getActiveSession");
const setLastActiveInSessionSQL = executeSQLFile("auth/setLastActiveInSession");
const isCommonClientSQL = executeSQLFile("auth/isCommonClient");

export interface SessionType {
  id: number;
  uuid: string;
  user_ip: string;
  user_agent: string;
  last_active: string;
  clientUUID: string;
  expires_at: string;
  created_at: string;
  possibly_insecure: boolean;
  disabled_session: boolean;
}

export class SessionRepository {
  async createSession(
    userId: number,
    userIp: string,
    userAgent: string,
    expiresAt: string,
    clientUUID: string
  ): Promise<string> {
    const uuid = uuidv4();

    await addActiveSessionSQL([
      userId,
      uuid,
      userIp,
      userAgent,
      expiresAt,
      clientUUID,
    ]);

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

  async isCommonClient(
    clientUUID: string,
    userAgent: string,
    tokenUUID: string,
    userId: number
  ): Promise<{ session_insecure: boolean; session_disabled: boolean }> {
    const { rows } = await isCommonClientSQL([
      clientUUID,
      userAgent,
      tokenUUID,
      userId,
    ]);

    return rows[0] || { session_insecure: false, session_disabled: false };
  }
}
