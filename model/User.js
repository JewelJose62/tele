const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  profile: {
      profilePicture: { type: String, default: '' },
      username: { type: String, required: true},
      bio: { type: String, default: '', maxlength: 200 }
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // Email verification status
  otp: { type: String }, // Store OTP
  otpExpires: { type: Date }, // OTP expiration time
  date: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});



// Method to check OTP validity
UserSchema.methods.isOtpValid = function (inputOtp) {
  return this.otp === inputOtp && new Date() < this.otpExpires;
};

module.exports = mongoose.model('User', UserSchema);







