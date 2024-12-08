import { Router } from 'express'; // Correct import for Router

import { registerUsers,logoutUsers } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';  // Correct import for upload middleware
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router(); // No conflict now
 
router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverimage', maxCount: 1 }
    ]),
    registerUsers);

    // secured routes 
    router.route("/logout").post(verifyJWT, logoutUsers)

export default router;
