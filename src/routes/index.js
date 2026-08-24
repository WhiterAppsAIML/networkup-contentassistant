const express = require('express');
const attachUser = require('../middleware/auth.middleware');
const contentRoutes = require('../modules/content-creation/content.routes');
const angleRoutes = require('../modules/angle-generation/angle.routes');
const hookRoutes = require('../modules/hook-generation/hook.routes');
const hooksLibraryRoutes = require('../modules/content-library/hooks.routes');
const leadMagnetRoutes = require('../modules/lead-magnet/lead-magnet.routes');
const scheduleRoutes = require('../modules/schedule/schedule.routes');
const frameworkRoutes = require('../modules/framework/framework.routes');
const ragRoutes = require('../modules/rag/rag.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// attachUser is scoped to each mount (not applied unconditionally) so a
// request to a path that doesn't exist at all falls through to the 404
// handler in app.js instead of being intercepted by the auth check first.
router.use('/content', attachUser, contentRoutes); // Modules 1, 4, 6 (nested), 7
router.use('/content/:id/angles', attachUser, angleRoutes); // Module 2
router.use('/content/:id/hooks', attachUser, hookRoutes); // Module 3
router.use('/hooks', attachUser, hooksLibraryRoutes); // Module 7 (hooks library)
router.use('/lead-magnets', attachUser, leadMagnetRoutes); // Module 8
router.use('/schedule', attachUser, scheduleRoutes); // Schedule
router.use('/frameworks', attachUser, frameworkRoutes); // Templates
router.use('/rag', attachUser, ragRoutes); // RAG (Module 10)

module.exports = router;
