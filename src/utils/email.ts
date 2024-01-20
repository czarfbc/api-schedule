import { Resend } from 'resend';
import { ISendEmail } from '../interfaces/email.interface';
import { env } from '../z.schema/env.z.schema';

class Email {
  async sendEmail({ inviteTo, subject, html }: ISendEmail) {
    const resend = new Resend(env.RESEND_KEY);
    const emailData = await resend.emails.send({
      from: 'ScheduleSystem <onboarding@resend.dev>',
      to: inviteTo,
      subject,
      html,
    });

    return emailData;
  }
}

export { Email };
