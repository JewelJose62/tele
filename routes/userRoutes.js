const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("_id username");
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
