import DB from '../db';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';
import { getPostComments } from '../utils/api';

export default {
  async createPost(req, res) {
    const { title, content } = req.body;

    if (!title) throw new BadRequestError('Please provide a valid post title');
    if (!content) throw new BadRequestError('Please provide text content for your post');

    const post = await DB.posts.create({ title, content, createdBy: req.user.id });

    return res.json({ post });
  },

  async getPost(req, res) {
    const { id } = req.params;

    if (!id) throw new BadRequestError('Invalid Post ID');

    const post = await DB.posts.findById(id);

    if (!post) throw new NotFoundError('Post Not Found!');

    const comments = await getPostComments(post.id);

    return res.json({ post, comments });
  },

  async updatePost(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title && !content) throw new BadRequestError('No update content specified');

    if (!id) throw new BadRequestError('Invalid Post ID');

    const post = await DB.posts.findById(id);
    if (!post) throw new NotFoundError('Post Not Found!');

    if (post.id !== req.user.id) throw new UnauthorizedError('You are not allowed to update this post');

    await DB.posts.update(id, { title, content });

    // return res.json({ post: updatedPost, message: 'Post updated successfully' });
    return res.redirect(`/api/post/${post.id}`);
  },

  async getAllPosts(req, res) {
    const posts = await DB.posts.getAll();
    return res.json({ posts });
  },

  async searchPosts(req, res) {
    const { search = '' } = req.query;
    const posts = await DB.posts.search(search);
    if (!posts.length) throw new NotFoundError(`No posts matching query ${search}`);
    return res.json({ posts });
  },
};
