import * as dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import controller from './components/controller';
import { getReqBody, checkReqBody } from './components/utils';
import { validate as isValidUUID } from 'uuid';

dotenv.config();
const port = process.env.PORT;

const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
  const path = req.url?.split('/').filter(Boolean);
  try {
    // GET api/users
    if (req.url === '/api/users' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const usersList = await controller.getUsers();
      res.end(JSON.stringify(usersList));

      // GET api/users by id
    } else if (path!.length > 2 && req.url!.includes('/api/users') && req.method === 'GET') {
      const userId = path![2];

      if (!isValidUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User id is invalid' }));
        return;
      }
      try {
        const userById = await controller.getById(userId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userById));
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err }));
      }

      // PUT update user
    } else if (path!.length > 2 && req.url!.includes('/api/users') && req.method === 'PUT') {
      const userId = path![2];

      if (!isValidUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User id is invalid' }));
        return;
      }
      try {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const bodyData = (await getReqBody(req)) as IUser;
        const checkData = await checkReqBody(bodyData);

        if (checkData) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: checkData }));
          return;
        }
        const user = await controller.updateUser(userId, bodyData);
        res.end(JSON.stringify(user));
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err }));
      }

      // DELETE delete user
    } else if (path!.length > 2 && req.url!.includes('/api/users') && req.method === 'DELETE') {
      const userId = path![2];

      if (!isValidUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User id is invalid' }));
        return;
      }

      try {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        const userDeleted = await controller.deleteUser(userId);
        res.end(JSON.stringify(userDeleted));
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err));
      }

      // POST create user
    } else if (req.url === '/api/users' && req.method === 'POST') {
      try {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        const bodyData = (await getReqBody(req)) as IUser;
        const checkData = await checkReqBody(bodyData);

        if (checkData) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: checkData }));
          return;
        }

        const user = await controller.createUser(bodyData);
        res.end(JSON.stringify(user));
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Endpoint not found` }));
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};

const server = createServer(requestListener);
server.listen(port);

export default interface IUser {
  id: string;
  name: string;
  age: string;
  hobbies: Array<string>;
}
