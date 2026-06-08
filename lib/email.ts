import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = "SA Sourcing Hub <notifications@sa-sourcing-hub.com>";

export async function sendEmail({ to, subject, text }: { to?: string | null; subject: string; text: string }) {
  if (!resend || !to) {
    console.info(`[email skipped] ${subject}: ${text}`);
    return;
  }

  await resend.emails.send({ from, to, subject, text });
}

export async function notifyAdminNewOrder(orderNumber: string, userName: string, country: string) {
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New order ${orderNumber}`,
    text: `New order #${orderNumber} from ${userName} in ${country}.`,
  });
}

export async function notifyUser(to: string | null | undefined, subject: string, message: string) {
  await sendEmail({ to, subject, text: message });
}
