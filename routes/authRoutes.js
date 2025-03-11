const express = require('express');
const router = express.Router();
const { bypass } = require('../middlewares/auth');
const authController = require('../controllers/authController');
const {verifyOtp} = require('../controllers/verifyOtpController')

router.get('/signup', bypass, (req, res) => {
    res.render('auth/signup'); // Add "auth/" before "signup"
});

router.get('/login', bypass, (req, res) => {
    res.render('auth/login'); // Add "auth/" before "login"
});


router.post('/verify-otp',authController.verifyOtp)
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);



module.exports = router;












