import fs from "fs";
import path from "path";

export const renderTemplate = (
  templateName: string,
  variables: Record<string, string>
): string => {
  const templatePath = path.join(
    __dirname,
    "../mail-templates",
    `${templateName}.html`
  );

  let template = fs.readFileSync(templatePath, "utf-8");

  for (const [key, value] of Object.entries(variables)) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return template;
};
