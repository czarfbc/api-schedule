import fs from 'fs';
import path from 'path';
import { IForgotPassword } from '../validations/interfaces/utils/messages.html.interface';

class MessagesHTMLUtils {
  createAccount(name: string) {
    const templatePath = path.resolve(
      __dirname,
      '../helpers/templates.html/create.account.helpers.html'
    );

    const templateHTML = fs.readFileSync(templatePath, 'utf-8');

    const result = templateHTML.replace('{{name}}', name);

    return result;
  }

  forgotPassword({ name, token }: IForgotPassword) {
    const templatePath = path.resolve(
      __dirname,
      '../helpers/templates.html/forgot.pass.helpers.html'
    );

    const templateHTML = fs.readFileSync(templatePath, 'utf-8');

    const result = templateHTML
      .replace('{{name}}', name)
      .replace('{{token}}', token);

    return result;
  }
}

export { MessagesHTMLUtils };
