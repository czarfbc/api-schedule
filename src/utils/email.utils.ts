import { ISendEmail } from '../validations/interfaces/utils/email.interfaces';
import { env } from '../validations/z.schemas/env.z.schemas';
import * as errorHelpers from '../helpers/error.helpers';
import * as nodemailer from 'nodemailer';

class EmailUtils {
  constructor() {}

  async sendEmail({ inviteTo, subject, html }: ISendEmail) {
    const transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '025f8db6fff808',
        pass: '5058a128519602',
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: env.NODEMAILER_EMAIL,
      to: inviteTo,
      subject: subject,
      html,
    };

    const emailData = await transport.sendMail(mailOptions);
    transport.close();

    if (!emailData) {
      throw new errorHelpers.InternalServerError({
        message: 'Error sending email',
      });
    }

    return emailData;
  }
}

export { EmailUtils };
