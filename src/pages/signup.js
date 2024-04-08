import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from "./home";
import { CgProfile } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import './css/login.css'
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
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
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="cover">
        <h1>Sign Up</h1>
        <p className="logintitle">Username</p>
        <input className="logininput" type="text" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <p className="logintitle">Password</p>
        <input className="logininput" type="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="logintitle">Confirm Password</p>
        <input className="logininput" type="password" placeholder="Retype your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <p className="logintitle">First Name</p>
        <input className="logininput" type="text" placeholder="Type your first name" value={fname} onChange={(e) => setFName(e.target.value)} />
        <p className="logintitle">Last Name</p>
        <input className="logininput" type="text" placeholder="Type your last name" value={lname} onChange={(e) => setLName(e.target.value)} />
        <p className="logintitle">Email</p>
        <input className="logininput" type="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <p className="logintitle">Phone Number</p>
        <input className="logininput" type="tel" placeholder="XXX-XXX-XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="login-btn" onClick={handleSignUp}>Sign Up</div>
        <p className="logintext">Already Have an Account? <a href="/">Login</a> </p>
        <a href="home" className="logintext">Go to home page (DEVTOOL)</a>
      </div>
    </div>
  );
}


