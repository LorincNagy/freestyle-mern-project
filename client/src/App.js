import './App.css';
import React, { useState } from 'react';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserProfile from './components/UserProfile';
import MainPage from './components/MainPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [eTitle, setETitle] = useState('')
  

  const handleLogin = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
  }

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setUserId(null);
  }

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  }
  const handleBackToLogin = () => {
    setShowSignUp(false);
  }

  return (
    <div>
      {!isLoggedIn && (
        <>
          <h1>WELCOME! </h1>
          <h1>Dear movie fanatics!</h1>
          {showSignUp ?
            <UserSignUp onSignUpComplete={toggleSignUp} onBackToLogin={handleBackToLogin} /> :
            <UserSignIn onLogin={handleLogin} onSignUp={toggleSignUp} />
          }
        </>
      )}
      {isLoggedIn && (
        <>
          <UserProfile userId={userId} onLogout={handleLogOut} setETitle={setETitle}/>
          <MainPage userId={userId} eTitle={eTitle}/>
        </>
      )}
    </div>
  );
}

export default App;

