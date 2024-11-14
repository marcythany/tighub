import express from 'express';
import {
	getUserProfileAndRepos,
	likeProfile,
} from '../controllers/userController.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';

const router = express.Router();

router.get('/profile/:username', getUserProfileAndRepos);

router.post('/like/:username', ensureAuthenticated, likeProfile);

export default router;
