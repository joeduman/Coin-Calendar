import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './css/settings.css';
import './css/navbar.css';

export default function SettingsPage() {
    const [username, setUsername] = useState('');
    const [inputs, setInputs] = useState([]);
    const [changePassword, setChangePassword] = useState(false);

    useEffect(() => {
        // Fetch username from local storage
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);

    useEffect(() => {
        if (username) {
            axios.get("http://localhost:5000/userinfo/" + username).then(function (response) {
                console.log(response.data);
                setInputs(response.data[0]);
            }).catch(function (error) {
                console.error('Error fetching settings:', error);
            });
        }
    }, [username]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let newpassword = null;
        // Validate phone number format (xxx-xxx-xxxx)
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(inputs.phone)) {
          alert('Please enter a valid phone number in the format xxx-xxx-xxxx');
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputs.email)) {
          alert('Please enter a valid email address');
          return;
        }
        if (inputs.newpassword){
          if (inputs.newpassword != null) {
            newpassword = inputs.newpassword
          }
        }
        axios.put("http://localhost:5000/userupdate/" + username, inputs, newpassword).then(function (response) {
            console.log(response.data);
            alert("Your account info has been updated.")
            window.location.href = '/home';
        });
    }

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (confirmDelete) {
            axios.delete("http://localhost:5000/deleteaccount/" + username).then(function (response) {
                window.location.href = '/';
            }).catch(function (error) {
                console.error('Error deleting account:', error);
            });
        } else {
          window.location.href = "/home";
          return;
        }
    }

    const handlePasswordChange = () => {
      // Toggle the changePassword state
      // Reset new password field when checkbox is unchecked
      if (changePassword) {
        setInputs({ ...inputs, newpassword: null });
      }
      setChangePassword(!changePassword);
  }

    return (
        <div>
            <nav className="navbar">
                <a href="/" className="site-title">Coin Calendar <a className="site-title-2">for visualizing your budget!</a></a>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/:username/dashboard">Dashboard</Link></li>
                    <li className="active"><Link to="/:username/settings">Settings</Link></li>
                    <li><Link to="/">Log Out</Link></li>
                </ul>
            </nav>
            <div className="Settings">
                <h1>Account Settings</h1>
                <div>
                    <form className="settingscontainer" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" placeholder="change first name" value={inputs.fname} name="fname" onChange={handleChange} ></input>
                            <input type="text" placeholder="change last name" value={inputs.lname} name="lname" onChange={handleChange} ></input>
                            <input type="text" placeholder="change email" value={inputs.email} name="email" onChange={handleChange} required></input>
                            <input type="text" placeholder="change phone #" value={inputs.phone} name="phone" onChange={handleChange} required></input>
                            <input type="text" value={inputs.password} onChange={handleChange} required></input>
                            {changePassword && <input type="text" placeholder="create new password" name="newpassword" onChange={handleChange} required></input>}
                            <label>
                                <input type="checkbox" checked={changePassword} onChange={handlePasswordChange} />
                                Change Password
                            </label>
                            <button type="submit" name="update" className="save">Save</button>
                            <Link to="/home">Cancel</Link>
                            <button className="delAccount" onClick={handleDeleteAccount}>Delete Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
