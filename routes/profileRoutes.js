const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlewares/upload'); // Import upload middleware

router.get('/', authController.getProfile);
router.post('/update', upload.single('profilePicture'), authController.updateProfile);

module.exports = router;

