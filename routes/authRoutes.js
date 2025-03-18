const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);


router.put("/profile/:userId", authController.updateProfile);
router.get("/profile/:userId", authController.getProfile);

// Render the register page
router.get("/register", (req, res) => {
    res.render("auth/register"); 
  });

router.post("/register", authController.register);

// Render the login page
router.get("/login", (req, res) => {
    res.render("auth/login"); 
  });
  
  router.post("/login", authController.login);


  // Render logout page 
router.get("/logout", authController.logout); 




module.exports = router;



