const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// Register User
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.render("auth/register", { error: "Email already exists" });
    user = await User.findOne({ "profile.username": username });
    if (user) return res.render("auth/register", { error: "Username already exists" });

    user = new User({
      profile: { username },
      email,
      password
    });

    await user.save();

return res.redirect('/login')
  }catch (error) {
    console.error(error);
    return res.render("auth/register", { error: "Registration failed. Please try again." });
  }
  }


// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      { return res.status(400).json({ error: "Invalid email or password" });

  }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    req.session.token = token;
    // res.json({ token, user });
    res.render('welcome')
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};


// exports.logout = (req, res) => {
//     req.session.destroy(() => {
//         res.redirect('/login');
//     });
// };


exports.logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid"); 
      res.redirect("/login"); 
  });
};


// **Get Profile**
exports.getProfile = async (req, res) => {
  if (!req.session.token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.redirect('/login');

    if (!user.profile.profilePicture) {
      user.profile.profilePicture = "/uploads/default.png";
    }

    res.render('profile', { user, message: req.flash() });
    // req.session.token = token;
    // res.redirect('/profile'); // or render the profile page
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// **Update Profile**
exports.updateProfile = async (req, res) => {
  try {
    if (!req.session.token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    const { username, bio } = req.body;

    let updateData = { "profile.username": username, "profile.bio": bio };

    if (req.file) {
      updateData["profile.profilePicture"] = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.redirect('/chat');

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).send("Server Error");
  }
};