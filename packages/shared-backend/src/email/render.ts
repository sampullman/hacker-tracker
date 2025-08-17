import mjml2html from 'mjml';
import { promises as fs } from 'fs';
import path from 'path';

// A simple (and naive) way to get the text content from HTML
const getTextContent = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

export async function renderTemplate(templateName: string, data: Record<string, any>) {
  const templatePath = path.resolve(
    process.cwd(),
    'packages/shared-backend/src/email/templates',
    `${templateName}.mjml`
  );

  try {
    const template = await fs.readFile(templatePath, 'utf-8');

    // A real implementation would use a templating engine like Handlebars or EJS
    // to replace variables in the template with the data.
    // For this example, we are not doing any variable replacement.
    const { html } = mjml2html(template);
    const text = getTextContent(html);

    return { html, text };
  } catch (error) {
    console.error(`Error rendering template ${templateName}:`, error);
    throw error;
  }
}
