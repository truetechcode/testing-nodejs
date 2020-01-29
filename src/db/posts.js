import lodash from 'lodash';
import { removeEmptyProps } from '../utils';

const posts = [];

export default {
  async create({ id, title, content, createdBy }) {
    const time = new Date().toISOString();
    const post = {
      id: id || posts.length + 1,
      title,
      content,
      createdBy,
      createdAt: time,
      updatedAt: time,
    };
    posts.push(post);
    return Promise.resolve(post);
  },

  search(str) {
    const searchRegex = new RegExp(str, 'gi');
    return Promise.resolve(posts.filter(p => Boolean(p.title.match(searchRegex) || p.content.match(searchRegex))));
  },

  findBy(obj) {
    return Promise.resolve(lodash.find(posts, obj));
  },

  findById(id) {
    return this.findBy({ id: Number(id) });
  },

  getAll() {
    return Promise.resolve(posts);
  },

  async update(id, updateObj) {
    const validUpateObject = removeEmptyProps(updateObj);

    let post = await this.findById(id);
    post = { ...post, ...validUpateObject };
    posts[id - 1] = post;

    return post;
  },
};
