import express from 'express';
import {
	getUserProfileAndRepos,
	likeProfile,
	getLikes,
	getUserProfile,
} from '../controllers/userController.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';

const router = express.Router();

router.get('/profile', ensureAuthenticated, getUserProfile);
router.get('/profile/:username', getUserProfileAndRepos);

router.get('/likes', ensureAuthenticated, getLikes);
router.post('/like/:username', ensureAuthenticated, likeProfile);

export default router;
