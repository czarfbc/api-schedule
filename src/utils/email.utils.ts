import { Resend } from 'resend';
import { ISendEmail } from '../interfaces/email.interface';
import { env } from '../z.schema/env.z.schema';
import { emailSchema } from '../z.schema/email.z.schema';

class EmailUtils {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(env.RESEND_KEY);
  }

  async sendEmail({ inviteTo, subject, html }: ISendEmail) {
    const validateInput = emailSchema.parse({ inviteTo, subject, html });

    const emailData = await this.resend.emails.send({
      from: 'ScheduleSystem <onboarding@resend.dev>',
      to: validateInput.inviteTo,
      subject: validateInput.subject,
      html: validateInput.html,
    });

    return emailData;
  }
}

export { EmailUtils };