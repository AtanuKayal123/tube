import { Router } from 'express'; // Correct import for Router

import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';  // Correct import for upload middleware

const router = Router(); // No conflict now
 
router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverimage', maxCount: 1 }
    ]),
    registerUser);

export default router;
