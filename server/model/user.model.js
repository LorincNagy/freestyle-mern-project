const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;


const userSchema = new Schema({
  name: String,
  userName: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
  favoriteMovies: [
    {
      movieTitle: String,
      movieId: String,
      releaseYear: Number,
    },
  ],
  reviewedMovies: [
    {
      movieTitle: String,
      movieId: String,
      comment: String,
      releaseYear: Number,
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});


const User = model('User', userSchema);

module.exports = User;
