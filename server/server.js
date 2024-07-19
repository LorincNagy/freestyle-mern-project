require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/user.model.js');

const { MONGO_URL, PORT = 5000 } = process.env;

if (!MONGO_URL) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

const app = express();
app.use(express.json());

//Server starter
async function startServer() {
  try {
    console.log('Connecting to the database...');
    await mongoose.connect(MONGO_URL);
    console.log('Connected to the database successfully!');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

//Controllers
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

const saveUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, userName, password } = req.body;
    const createdAt = Date.now();
    const updatedAt = Date.now();
    const users = new User({
      name,
      userName,
      password,
      createdAt,
      updatedAt,
    });
    const savedUser = await users.save();
    savedUser.password = null;
    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password.' });
    }
    user.password = null;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    user.password = null;
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, movieTitle, releaseYear } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      $push: { favoriteMovies: { movieId, movieTitle, releaseYear } },
    }, { new: true });
    user.password = null;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getFavoriteMovies = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const favoriteMovies = user.favoriteMovies.sort();
    res.json(favoriteMovies);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

const getReviewedMovies = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const reviewedMovies = user.reviewedMovies.sort();
    res.json(reviewedMovies);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieTitle, movieId, releaseYear, comment } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      $push: { reviewedMovies: { movieTitle, movieId, releaseYear, comment } },
    }, { new: true });
    user.password = null;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const editUsername = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUserName } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      $set: { userName: newUserName },
    }, { new: true });
    user.password = null;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const users = await User.find({ 'reviewedMovies.movieId': movieId });
    const reviews = users.map((user) => ({
      username: user.userName,
      review: user.reviewedMovies.find((movie) => movie.movieId === movieId).comment,
    }));
    res.json(reviews);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching reviews.' });
  }
};

//Routes
app.route('/api/users')
  .get(getUsers)
  .post(saveUser);

app.route('/api/users/login')
  .post(loginUser);

app.route('/api/users/:id')
  .get(getUserProfile)
  .patch(editUsername)
  .delete(deleteUser);

app.route('/api/users/:id/reviewedMovies')
  .get(getReviewedMovies);

app.route('/api/users/:id/favoriteMovies')
  .get(getFavoriteMovies);

app.route('/api/users/favorites/:id')
  .patch(addToFavorites);

app.route('/api/users/review/:id')
  .patch(addReview);

app.route('/api/reviews/:movieId')
  .get(getUserReviews);

startServer();


