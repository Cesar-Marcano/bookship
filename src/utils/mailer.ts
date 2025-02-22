import nodemailer from "nodemailer";

import { nodemailerConfig } from "../config";
import { renderTemplate } from "../utils/renderMailTemplate";
import logger from "../config/logger";

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>
): Promise<string> => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const htmlContent = renderTemplate(templateName, variables);

  const mailOptions = {
    from: `"No Reply" <${nodemailerConfig.auth.user}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return info.response;
  } catch (error) {
    logger.error(error);

    throw error;
  }
};
