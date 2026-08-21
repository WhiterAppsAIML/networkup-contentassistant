const express = require('express');
const attachUser = require('../middleware/auth.middleware');
const contentRoutes = require('../modules/content-creation/content.routes');
const angleRoutes = require('../modules/angle-generation/angle.routes');
const hookRoutes = require('../modules/hook-generation/hook.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// attachUser is scoped to each mount (not applied unconditionally above)
// so a request to a path that doesn't exist at all falls through to the
// 404 handler in app.js, instead of being intercepted by the auth check
// and returning a misleading 401 for routes that were never real.
router.use('/content', attachUser, contentRoutes);
router.use('/content/:id/angles', attachUser, angleRoutes);
router.use('/content/:id/hooks', attachUser, hookRoutes);

module.exports = router;
