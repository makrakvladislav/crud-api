import server, { IUser } from './index';

const request = require('supertest');

const mockData = {
  name: 'Anton',
  age: 33,
  hobbies: ['test'],
};

const mockDataUpdate = {
  name: 'Egor',
  age: 23,
  hobbies: ['test'],
};

describe('Tests for API', () => {
  let userData: IUser;

  it('Get all records: GET api/users', async () => {
    await request(server).get('/api/users').expect(200, []);
  });

  it('New object created: POST api/users', async () => {
    const user = await request(server).post('/api/users').send(mockData).expect(201);
    userData = user.body;
    expect(user.body).toEqual(
      expect.objectContaining({
        name: 'Anton',
        age: 33,
        hobbies: ['test'],
      })
    );
  });

  it('Get user by Id: GET api/user/{userId}', async () => {
    const getUserById = await request(server).get(`/api/users/${userData.id}`).expect(200);
    expect(getUserById.body[0]).toEqual(expect.objectContaining(userData));
  });

  it('Update the created record : PUT api/users/{userId}', async () => {
    const updateUserById = await request(server).put(`/api/users/${userData.id}`).send(mockDataUpdate).expect(200);
    expect(updateUserById.body).toEqual(
      expect.objectContaining({
        name: 'Egor',
        age: 23,
        hobbies: ['test'],
      })
    );
  });

  it('Delete the created object by Id: Delete api/user/{userId}', async () => {
    await request(server).delete(`/api/users/${userData.id}`).expect(204);
  });

  it('Get a deleted object by Id: GET api/users/{userId}', async () => {
    await request(server).get(`/api/users/${userData.id}`).expect(404);
  });

  server.close();
});
