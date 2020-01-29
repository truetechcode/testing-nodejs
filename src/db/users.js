import lodash from 'lodash';

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.name = data.name || '';
    this.created = new Date().toISOString();

    this.getPassword = function() {
      return data.password;
    };
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
        id: id || users.length + 1,
        username,
        name,
        password,
      });

      users.push(user);

      return resolve(user);
    });
  },
};
