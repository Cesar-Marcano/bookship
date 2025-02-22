import nodemailer from "nodemailer";

import { nodemailerConfig } from "../config";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const mailOptions = {
    from: `"No Reply" <${nodemailerConfig.auth.user}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado: " + info.response);
  } catch (error) {
    console.error("Error al enviar el email:", error);
  }
};
