// src/App.jsx
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="signup-container">
      <form className="signup-form">
        <h2>SignUp</h2>
        <div className='formitem'>
        <label>Username or email</label>
        <input type="text" placeholder="Enter username or email id" />
        </div>
        <div className='formitem'>
        <label>Password</label>
        <input type="password" placeholder="Enter password" />
        </div>
        <div className='formitem'>
        <label>Confirm Password</label>
        <input type="password" placeholder="Enter password" />
        </div>
        <div className='formitem'>
        <label>Aadhar Card</label>
        <input type="text" placeholder="Enter Aadhar card details" />
        </div>
        <div className='formitem'>
        <label>Phone Number</label>
        <input type="tel" placeholder="+91" />
        </div>
        <div className='formitem'>
        <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
    
  );
}

export default App;
