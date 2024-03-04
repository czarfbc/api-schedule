import { ISendEmail } from '../validations/interfaces/services/email.interfaces';
import { env } from '../validations/z.schemas/env.z.schemas';
import * as errorHelpers from '../helpers/error.helpers';
import * as nodemailer from 'nodemailer';

class EmailUtils {
  constructor() {}

  async sendEmail({ inviteTo, subject, html }: ISendEmail) {
    var transport = nodemailer.createTransport({
      host: env.HOST,
      port: env.EMAIL_PORT,
      auth: {
        user: env.USER,
        pass: env.PASS,
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
