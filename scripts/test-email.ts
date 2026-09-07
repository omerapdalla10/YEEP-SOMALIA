/**
 * Send the welcome email to one address, to check your SMTP settings.
 *
 *   npm run test:email -- you@example.com "Your Name"
 *
 * Reads SMTP_* from .env.local (via the --env-file flag in the npm script).
 */
import { sendMail } from "../lib/api/mailer";
import { welcomeEmail } from "../lib/api/emails/welcome";
import { emailEnabled, smtp } from "../lib/env";

async function main() {
  const to = process.argv[2];
  const name = process.argv[3] || "Test User";

  if (!to) {
    console.error('Usage: npm run test:email -- you@example.com "Your Name"');
    process.exit(1);
  }

  if (!emailEnabled) {
    console.error("SMTP is not configured — set SMTP_HOST, SMTP_USER and SMTP_PASS in .env.local");
    process.exit(1);
  }

  console.log(`Sending welcome email as ${smtp.from}`);
  console.log(`  host: ${smtp.host}:${smtp.port} (secure: ${smtp.secure})`);
  console.log(`  to:   ${to}`);

  const mail = welcomeEmail(name);
  const okSent = await sendMail({ to, ...mail });

  if (okSent) {
    console.log("\n✅ Sent. Check the inbox (and the spam folder).");
  } else {
    console.error("\n❌ Failed — see the error above.");
    process.exit(1);
  }
}

main();
