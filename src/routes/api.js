import { Router } from 'express';

import AuthController from '../controllers/auth-controller';
import PostsController from '../controllers/posts-controller';

const router = Router();
const authRouter = Router();

router.use('/auth', authRouter);

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.get('/me', AuthController.verifyAuthentication, AuthController.getMe);

router.use(AuthController.verifyAuthentication);

router.post('/post', PostsController.createPost);
router.get('/posts', PostsController.getAllPosts);
router.get('/post/:id', PostsController.getPost);
router.get('/post', PostsController.searchPosts);
router.patch('/post/:id', PostsController.updatePost);

export default router;
