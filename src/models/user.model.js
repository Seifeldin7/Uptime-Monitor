const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please Enter your email!'],
      unique: [true, 'This email is used!'],
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email!'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please enter your password!'],
      minlength: [8, 'Password is very short!'],
      select: false
    },
    verifyToken: {
      type: String,
      select: false
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
    discriminatorKey: 'type'
  }
);

userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 8);

  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };
