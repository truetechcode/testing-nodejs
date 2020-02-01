import lodash from 'lodash';

export class User {
  constructor(data) {
    this.id = data.id || users.length + 1;
    this.username = data.username;
    this.name = data.name || '';
    this.created = new Date().toISOString();

    this.getPassword = function() {
      return data.password || '$2a$10$4ZoiugORb5z698zjfTg0FOcqD68BR6.ZAEDpYNVQ7YuNbnsSrNKTO';
    };

    return this;
  }
}

let users = [];

export default {
  findBy(queryObj) {
    return Promise.resolve(lodash.find(users, queryObj));
  },

  findById(id) {
    return this.findBy({ id: Number(id) });
  },

  findByUserName(username) {
    return this.findBy({ username });
  },

  getAll() {
    return Promise.resolve(users);
  },

  create({ id, username, name, password }) {
    return new Promise(resolve => {
      const user = new User({
        id,
        username,
        name,
        password,
      });

      users.push(user);

      return resolve(user);
    });
  },
};
