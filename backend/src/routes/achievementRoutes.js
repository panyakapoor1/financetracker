const express = require('express');
const router = express.Router();
const { getAchievements, evaluateAchievements } = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAchievements);
router.post('/evaluate', evaluateAchievements);

module.exports = router;
