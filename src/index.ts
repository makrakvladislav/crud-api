import * as dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import controller from './components/controller';
import getReqBody from './components/getReqBody';

dotenv.config();
const port = process.env.PORT;

const requestListener = async (req: IncomingMessage, res: any) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const usersList = await controller.getUsers();
    res.end(JSON.stringify(usersList));
  } else if (req.url === '/api/users' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    /*
    let body = '';
    req
      .on('data', (chunk) => {
        body += chunk;
      })
      .on('end', () => {
        //users.push(JSON.parse(body));
        return res.end(body);
      });
    console.log(body);
    */
    const bodyData = await getReqBody(req);
    const user = await controller.createUser(bodyData);
    res.end(JSON.stringify(user));
  } else {
    res.end('Error!');
  }
};

const server = createServer(requestListener);
server.listen(port);
