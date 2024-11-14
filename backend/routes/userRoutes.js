import express from 'express';
import { getUserProfileAndRepos } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile/:username', getUserProfileAndRepos);

// TODO - GET Likes and POST Likes a profile

export default router;
