import React, { useState } from "react";
import axios from 'axios';
import './css/signup.css';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = async () => {
    // Check if password and confirm password match
    // Add any additional validation logic if needed
    if (!username || !password || !confirmPassword || !fname || !lname || !email || !phone) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate phone number format (xxx-xxx-xxxx)
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid phone number in the format xxx-xxx-xxxx');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      // Send user data to backend
      await axios.post('http://localhost:5000/signup', {
        username,
        password,
        fname,
        lname,
        email,
        phone
      });
      
      alert('Sign up successful'); // Display success message
      // You can reset the form fields here if needed
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signupPage">
      <h1 className="pagetitle">Coin Calendar</h1>
      <div className="signupCover">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <p className="signupText">Username</p>
          <input className="signupInput" type="text" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <p className="signupText">Password</p>
          <input className="signupInput" type="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="signupText">Confirm Password</p>
          <input className="signupInput" type="password" placeholder="Retype your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <p className="signupText">First Name</p>
          <input className="signupInput" type="text" placeholder="Type your first name" value={fname} onChange={(e) => setFName(e.target.value)} />
          <p className="signupText">Last Name</p>
          <input className="signupInput" type="text" placeholder="Type your last name" value={lname} onChange={(e) => setLName(e.target.value)} />
          <p className="signupText">Email</p>
          <input className="signupInput" type="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className="signupText">Phone Number</p>
          <input className="signupInput" type="tel" placeholder="XXX-XXX-XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit" className="signupBtn">Sign Up</button>
        </form>
        <p className="logintext">Already Have an Account? <a href="/">Login</a> </p>
      </div>
    </div>
  );
}


