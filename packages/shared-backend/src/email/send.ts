import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { emailConfig } from "../config/email.js";

const mailerSend = new MailerSend({
  apiKey: emailConfig.mailerSendApiKey,
});

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: {
    email: string;
    name: string;
  };
}

export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text } = options;

  const from = options.from || {
    email: "no-reply@hackertracker.com",
    name: "Hacker Tracker",
  };

  const sentFrom = new Sender(from.email, from.name);

  const recipients = Array.isArray(to)
    ? to.map((email) => new Recipient(email))
    : [new Recipient(to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(html)
    .setText(text);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
