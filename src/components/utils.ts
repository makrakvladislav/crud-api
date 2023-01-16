import { IUser } from 'src';
import { IncomingMessage } from 'http';

export const getReqBody = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req
      .on('data', (chunk: string) => {
        body += chunk.toString();
      })
      .on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject('Empty body');
        }
      });
  });
};

export const checkReqBody = (data: IUser) => {
  if (!data.name || !data.age || !data.hobbies) {
    return 'Body does not contain required fields';
  }
  if (typeof data.name !== 'string') {
    return 'Name must be string';
  }
  if (typeof data.age !== 'number') {
    return 'Age must be number';
  }
  if (!Array.isArray(data.hobbies)) {
    return 'Hobbies must be array';
  }
};
