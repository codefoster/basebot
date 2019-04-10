import { ComponentDialog, DialogSet } from 'botbuilder-dialogs';
import { BotServices } from '../services/botservices';
import { readdir } from 'fs';
import { posix } from 'path';

export class DialogLoader {
  async getFiles(dir): Promise<string[]> {
    return new Promise(function (resolve, reject) {
      readdir(dir, function (err, files) {
        if (err) reject(`Unable to scan directory: ${err}`);
        resolve(files);
      });
    })
  };

  async loadDialogs(dir, dialogs: DialogSet, botServices : BotServices) {
    const files = await this.getFiles(dir)
    files.forEach(async dialog => {
      const widget = await import(`${dir}${posix.sep}${dialog}`);
      for (let prop in widget) {
        let type = widget[prop];
        if (Object.getPrototypeOf(type) === ComponentDialog) {
          const dialog = new type(prop,botServices);
          dialogs.add(dialog);
        }
      }
    });
  }
}

