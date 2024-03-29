import { Resend } from 'resend';
import { ISendEmail } from '../validations/interfaces/services/email.interfaces';
import { env } from '../validations/z.schemas/env.z.schemas';
import { emailSchema } from '../validations/z.schemas/email.z.schemas';
import { ErrorsHelpers } from '../helpers/errors.helpers';

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

    if (!emailData) {
      throw new ErrorsHelpers({
        message: 'Error sending email',
        statusCode: 500,
      });
    }

    return emailData;
  }
}

export { EmailUtils };
