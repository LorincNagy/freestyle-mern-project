import React, { useEffect, useState } from "react";

function UserProfile({ userId, onLogout, setETitle }) {
  const [userData, setUserData] = useState({ name: '', userName: '' });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [showReviewedMovies, setShowReviewedMovies] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [showFavoriteMovies, setShowFavoriteMovies] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserData();
  }, [userId]);

  if (!userData) {
    return 'Loading profile...';
  }

  const deleteProfile = async (id) => {
    if (window.confirm('Confirm deletion of your profile')) {
      try {
        await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });
        onLogout();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const fetchReviewedMovies = async () => {
    if (showReviewedMovies) {
      setShowReviewedMovies(false);
    } else {
      try {
        const response = await fetch(`/api/users/${userId}/reviewedMovies`);
        const reviewedMoviesData = await response.json();
        console.log(reviewedMoviesData);
        setReviewedMovies(reviewedMoviesData);
        setShowReviewedMovies(true);
      } catch (error) {
        console.error('Error fetching reviewed movies:', error);
      }
    }
  }

  const renderReviewedMovies = () => {
    return reviewedMovies.map((movie) => (
      <div key={movie._id}>
        <h3><u>Title:</u> {movie.movieTitle}</h3>
        <p>Comment: {movie.comment}</p>
      </div>
    ));
  };

  const fetchFavoriteMovies = async () => {
    if (showFavoriteMovies) {
      setShowFavoriteMovies(false);
    } else {
      try {
        const response = await fetch(`/api/users/${userId}/favoriteMovies`)
        const favoriteMoviesData = await response.json();
        console.log(favoriteMoviesData);
        setFavoriteMovies(favoriteMoviesData)
        setShowFavoriteMovies(true);
      } catch (error) {
        console.error('Error fetching favorite movies', error);
      }
    }
  }

  const handleFavMovies = (e) => {
    setETitle(e.target.innerText)
  }

  const renderFavoriteMovies = () => {
    return favoriteMovies.map((movie, index) => (
      <div key={movie._id}>
        <h3><u>Title:</u></h3>
       <p onClick={handleFavMovies} key={index} class="clickable-text">{movie.movieTitle}</p>

      </div>
    ))
  }

  const updateUserName = async (e) => {
    e.preventDefault();
    if (window.confirm('Confirm edit!')) {
      try {
        const response = await fetch(`/api/users/${userId}/username`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newUserName }),
        });
        const updatedUser = await response.json();
        setUserData(updatedUser);
      } catch (error) {
        console.error('Error updating username:', error);
      }
    }
  };

  const toggleEditUsername = () => {
    setIsEditingUsername(!isEditingUsername);
    setNewUserName('');
  };

  return (
    <div className="userprofile-container">
      <button onClick={toggleProfile} id="user-shower-button">User Profile</button>
      {isProfileOpen && (
        <div className="form-container" id="userprofil-form">
          <p>Name: {userData.name}</p>
          <p>User Name: {userData.userName}</p>
          <button onClick={toggleEditUsername}>Edit Username</button>
          {isEditingUsername && (
            <form onSubmit={updateUserName}>
              <label htmlFor="newUserName">New Username:</label>
              <input
                type="text"
                id="newUserName"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <button type="submit">Update Username</button>
            </form>
          )}
          <br />
          <button onClick={fetchFavoriteMovies}>Favorite Movies</button>
          <br />
          {showFavoriteMovies && favoriteMovies.length > 0 && renderFavoriteMovies()}
          <br />
          <button onClick={fetchReviewedMovies}>Reviewed Movies</button>
          <br />
          {showReviewedMovies && reviewedMovies.length > 0 && renderReviewedMovies()}
          <br />
          <button onClick={() => deleteProfile(userId)}>Delete Profile</button>
          <button onClick={() => onLogout()}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
