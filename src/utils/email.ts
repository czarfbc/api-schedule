import { Resend } from 'resend';
import { ISendEmail } from '../interfaces/email.interface';

class Email {
  async sendEmail({ inviteTo, subject, html }: ISendEmail) {
    const resend = new Resend(process.env.RESEND_KEY);
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
