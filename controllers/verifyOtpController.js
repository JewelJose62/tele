// exports.verifyOtp = async (req, res) => {
//     const { email, otp } = req.body;
  
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).send('User not found.');
  
//     // Check if OTP is correct and not expired
//     if (user.otp !== otp) return res.status(400).send('Incorrect OTP.');
//     if (Date.now() > user.otpExpiry) return res.status(400).send('OTP expired.');
  
//     // Mark user as verified
//     user.isVerified = true;
//     await user.save();
  
//     res.status(200).send('Email verified successfully!');
//   };
  


  