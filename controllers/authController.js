// const User = require('../model/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer')
// const crypto = require('crypto')




// // // Create transporter for sending emails
// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: 'jewel.stackup@gmail.com', // Your email
// //     pass: 'svjl fobd tpsx mfgs'    // Your email password (use environment variables for better security)
// //   }
// // });


// // exports.signup = async (req, res) => {
// //   try {
// //       const { username, email, password, confirmPassword } = req.body;

// //       if (password !== confirmPassword) {
// //           return res.status(400).send("Passwords do not match!");
// //       }

// //       // Check if email is already registered
// //       const existingUser = await User.findOne({ email });
// //       if (existingUser) {
// //           return res.status(400).send('Email already in use');
// //       }


// //   // Generate OTP
// //   const otp = crypto.randomInt(100000, 999999).toString();

// //       // Ensure username is provided and not empty
// //       if (!username || username.trim() === '') {
// //         return res.status(400).send('Username is required');
// //     }
// //       // Hash the password
// //       const hashedPassword = await bcrypt.hash(password, 10);

// //       const newUser = new User({
// //         profile: { username },
// //         // instead of profile: { username }
// //         email,
// //         password : hashedPassword
// //       });
      
// //       console.log('Username:', req.body.username); // Check the value


// //       await newUser.save();
// //       res.redirect('/login'); 
// //   } catch (error) {
// //       console.error("Signup Error:", error);
// //       res.status(400).send(error.message);
// //   }
// // };


// const otpStore = new Map(); // Store OTPs temporarily

// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER, // Use environment variables
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Generate OTP
// function generateOtp() {
//   return crypto.randomInt(100000, 999999).toString();
// }

// otpStore.set(email, { code: generatedOtp, expiresAt: Date.now() + 5 * 60000 });


// // Signup Route with OTP
// exports.signup = async (req, res) => {
//   try {
//     const { username, email, password, confirmPassword, otp } = req.body;

//     // Validate password match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match!" });
//     }

//     // Check if email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     // If OTP is provided, verify it
//     if (otp) {
//       const storedData = otpStore.get(email);
//       if (!storedData) {
//         return res.status(400).json({ message: 'OTP expired! Please request a new one.' });
//       }

//       const { code, expiresAt } = storedData;
//       if (Date.now() > expiresAt) {
//         otpStore.delete(email);
//         return res.status(400).json({ message: 'OTP expired! Please request a new one.' });
//       }

//       if (code !== otp) {
//         return res.status(400).json({ message: 'Invalid OTP! Please try again.' });
//       }

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Create new user
//       const newUser = new User({
//         profile: { username },
//         email,
//         password: hashedPassword
//       });

//       await newUser.save();
//       otpStore.delete(email); // Remove OTP after successful signup
//       return res.status(200).json({ message: "Signup successful! Redirecting to login." });
//     }

//     // Generate new OTP and store with expiration
//     const generatedOtp = generateOtp();
//     otpStore.set(email, { code: generatedOtp, expiresAt: Date.now() + 5 * 60000 });

//     // Send OTP via email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your Chat App OTP Verification',
//       text: `Your OTP for signup is: ${generatedOtp}. It is valid for 5 minutes.`
//     };

//     await transporter.sendMail(mailOptions);
//     res.render("otp-verification", { email });

//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ message: "An error occurred during signup." });
//   }
// };

// // // Resend OTP Route
// // const resendOTP = async (req, res) => {
// //   try {
// //     const { email } = req.body;

// //     if (!email) {
// //       return res.status(400).json({ message: 'Email is required' });
// //     }

// //     // Generate new OTP and update expiration
// //     const newOtp = generateOtp();
// //     otpStore.set(email, { code: newOtp, expiresAt: Date.now() + 5 * 60000 });

// //     // Send new OTP via email
// //     await transporter.sendMail({
// //       from: process.env.EMAIL_USER,
// //       to: email,
// //       subject: 'New OTP for Chat App',
// //       text: `Your new OTP is: ${newOtp}. It is valid for 5 minutes.`
// //     });

// //     res.render("otp-verification", { email });
// //   } catch (error) {
// //     console.error("Resend OTP Error:", error);
// //     res.status(500).json({ message: 'Error resending OTP' });
// //   }
// // };


// exports.resendOTP = async (req, res) => {
//   try {
//       const { email } = req.body; // Extract email from request body

//       if (!email) {
//           return res.status(400).json({ error: "Email is required" });
//       }

//       const generatedOtp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

//       // Store OTP with expiry (5 minutes)
//       otpStore.set(email, { code: generatedOtp, expiresAt: Date.now() + 5 * 60000 });

//       // Send OTP via email (assuming sendMail is correctly set up)
//       await sendMail(email, "Your OTP Code", `Your OTP is: ${generatedOtp}`);

//       return res.json({ message: "OTP sent successfully" });
//   } catch (error) {
//       console.error("Error in resendOTP:", error);
//       return res.status(500).json({ error: "Internal server error" });
//   }
// };


// exports.verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   const storedData = otpStore.get(email);
//   if (!storedData) {
//     return res.status(400).json({ message: "OTP expired! Please request a new one." });
//   }

//   const { code, expiresAt } = storedData;

//   if (Date.now() > expiresAt) {
//     otpStore.delete(email);
//     return res.status(400).json({ message: "OTP expired! Please request a new one." });
//   }

//   if (code !== otp) {  // Fix: Check storedData.code instead of storedData
//     return res.status(400).json({ message: "Invalid OTP! Please try again." });
//   }

//   otpStore.delete(email); // Remove OTP after successful verification
//   return res.json({ message: "OTP verified! Proceed to login." });
// };


// exports.login = async (req, res) => {
//   try {
//       const { email, password } = req.body;

//       // Find user by email
//       const user = await User.findOne({ email });
//       if (!user) {
//           return res.status(400).send('User not found');
//       }

//       // Compare passwords
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//           return res.status(400).send('Invalid password');
//       }

//       // Generate JWT token
//       const token = jwt.sign(
//           { id: user._id, username: user.profile.username },  
//           process.env.JWT_SECRET,
//           { expiresIn: '1h' }
//       );

//       req.session.token = token; // Store token in session
      
//       res.redirect('/welcome'); 
//   } catch (error) {
//       console.error("Login Error:", error);
//       res.status(400).send(error.message);
//   }
// };

// exports.logout = (req, res) => {
//     req.session.destroy(() => {
//         res.redirect('/login');
//     });
// };



// // GET Profile Page
// exports.getProfile = async (req, res) => {
//   if (!req.session.token) return res.redirect('/login'); // Fix: Check token instead of req.session.user

//   try {
//     const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
    
//       const user = await User.findById(decoded.id);

//       if (!user) return res.redirect('/login'); // If user not found, redirect

//       if (!user.profile.profilePicture) {
//         user.profile.profilePicture = "/uploads/default.png"; // Ensure you have this image in `public/uploads`
//     }

//       res.render('profile', { user,
//         message:req.flash()
//       }); // Fix: Use res.render() instead of res.redirect()
//   } catch (error) {
//       console.error(error);
//       res.status(500).send("Server Error");
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//       console.log("Request Body:", req.body);
//       console.log("Request File:", req.file);

//       if (!req.session.token) return res.status(401).json({ message: "Not authenticated" });

//       const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
//       const { username, bio } = req.body;

//       let updateData = { "profile.username": username, "profile.bio": bio };

//       if (req.file) {
//           updateData["profile.profilePicture"] = `/uploads/${req.file.filename}`;
//       }

//       const updatedUser = await User.findByIdAndUpdate(
//           decoded.id,
//           { $set: updateData },
//           { new: true }
//       ).select("-password");
//       console.log("Updated User:", updatedUser);  // Debugging

//       if (!updatedUser) return res.status(404).json({ message: "User not found" });

//       res.redirect('/chat');

    
//   } catch (error) {
//       console.error("Profile update error:", error);
//       res.status(500).send("Server Error");
//   }
// };



const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store OTPs temporarily
const otpStore = new Map();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// **Signup (Step 1: Request OTP)**
exports.signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedOtp = generateOtp();

    otpStore.set(email, {
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60000, // 5 minutes
      userData: { username, email, password: hashedPassword }
    });

    console.log(`✅ OTP Generated: ${generatedOtp} for ${email}`);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Chat App OTP Verification',
      text: `Your OTP for signup is: ${generatedOtp}. It is valid for 5 minutes.`
    });

    res.render("otp-verification", { email });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "An error occurred during signup." });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log(`🔹 Verifying OTP for ${email}`);
    
    const storedData = otpStore.get(email);
    if (!storedData) {
      console.log(`❌ No OTP found for ${email}.`);
      return res.status(400).json({ message: "OTP expired! Please request a new one." });
    }

    const { otp: storedOtp, expiresAt, userData } = storedData;

    if (Date.now() > expiresAt) {
      otpStore.delete(email);
      console.log(`❌ OTP expired for ${email}.`);
      return res.status(400).json({ message: "OTP expired! Please request a new one." });
    }

    if (storedOtp !== otp) {
      console.log(`❌ Invalid OTP! Expected: ${storedOtp}, Received: ${otp}`);
      return res.status(400).json({ message: "Invalid OTP! Please try again." });
    }

    if (!userData.username) {
      console.log(`❌ Username is missing for ${email}`);
      return res.status(400).json({ message: "Username is required!" });
    }

    console.log(`✅ OTP Verified Successfully for ${email}`);

    // Ensure user profile is correctly structured
    const newUser = new User({
      profile: { 
        username: userData.username, 
        profilePicture: '' // Default profile picture
      },
      email: userData.email,
      password: userData.password
    });

    await newUser.save();
    otpStore.delete(email);
    console.log(`✅ User ${email} saved to database successfully!`);

    // **Auto-login after signup**
    const token = jwt.sign(
      { id: newUser._id, username: newUser.profile.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    req.session.token = token;
    console.log(`✅ User ${email} logged in successfully!`);

    return res.redirect('/chat');

  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "An error occurred during OTP verification." });
  }
};


// **Resend OTP**
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingData = otpStore.get(email);
    if (!existingData) {
      return res.status(400).json({ message: "No signup request found. Please register again." });
    }

    const newOtp = generateOtp();
    existingData.otp = newOtp;
    existingData.expiresAt = Date.now() + 5 * 60000; // Extend expiry

    otpStore.set(email, existingData);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'New OTP for Chat App',
      text: `Your new OTP is: ${newOtp}. It is valid for 5 minutes.`
    });

    res.json({ message: "New OTP sent successfully" });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: 'Error resending OTP' });
  }
};

// **Login User**
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.profile.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    req.session.token = token;
    console.log(`✅ User ${email} logged in successfully!`);

    res.redirect('/chat');

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

// **Logout**
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
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
