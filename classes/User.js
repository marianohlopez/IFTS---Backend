import { readFile, writeFile } from 'fs/promises';

const userPath = './data/user.json';

class User {
  constructor(username, password, loggedIn = false) {
    this.username = username;
    this.password = password;
    this.loggedIn = loggedIn;
  }

  static async get() {
    try {
      const data = await readFile(userPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading user data:', err);
      return null;
    }
  }

  static async save(user) {
    try {
      await writeFile(userPath, JSON.stringify(user, null, 2));
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  }
}

export default User;
