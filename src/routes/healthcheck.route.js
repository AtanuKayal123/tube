import { Router } from 'express'; // Correct import for Router

import { healthcheck } from '../controllers/healthcheck.controller.js';

const router = Router(); // No conflict now

router.route('/').get(healthcheck);

export default router;
