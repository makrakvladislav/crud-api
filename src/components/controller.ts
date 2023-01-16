import IUser from 'src';
import { v4 as uuidv4 } from 'uuid';

class Controller {
  users: Array<IUser> = [];

  async getUsers() {
    return this.users;
  }

  async getById(userId: string) {
    return new Promise((resolve, reject) => {
      const userById = this.users.filter((user: { id: string }) => user.id === userId);
      if (userById.length !== 0) {
        resolve(userById);
      } else {
        reject(`User not found by id ${userId}`);
      }
    });
  }

  async createUser(userData: Omit<IUser, 'id'>) {
    return new Promise((resolve) => {
      const user = {
        id: uuidv4(),
        ...userData,
      };
      this.users.push(user);
      resolve(user);
    });
  }

  async updateUser(userId: string, userData: Omit<IUser, 'id'>) {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        this.users[userIndex] = {
          id: userId,
          ...userData,
        };
        resolve(this.users[userIndex]);
      } else {
        reject(`User not found by id ${userId}`);
      }
    });
  }

  async deleteUser(userId: string) {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        this.users.splice(userIndex, 1);
        resolve(`User ${userId} deleted`);
      } else {
        reject(`User not found by id ${userId}`);
      }
    });
  }
}

export default new Controller();
