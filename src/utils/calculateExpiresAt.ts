import dayjs, { ManipulateType } from "dayjs";

export const calculateExpiresAt = (expiresIn: string): string => {
  const value = parseInt(expiresIn);
  const unit = expiresIn.slice(-1);

  return dayjs()
    .add(value, unit as ManipulateType)
    .toISOString();
};
