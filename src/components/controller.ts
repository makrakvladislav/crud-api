import { v4 as uuidv4 } from 'uuid';

class Controller {
  users: any = [];

  async getUsers() {
    return this.users;
  }

  async createUser(userData: any) {
    return new Promise((resolve) => {
      const user = {
        id: uuidv4(),
        ...userData,
      };
      this.users.push(user);
      resolve(user);
    });
  }
}

export default new Controller();
