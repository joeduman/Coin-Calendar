import HomePage from "./home";
import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import './css/settings.css';
import './css/navbar.css';

export default function SettingsPage() {
    const [username, setUsername] = useState('');
    const [inputs, setInputs] = useState([]);

    useEffect(() => {
        // Fetch username from local storage
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);


    useEffect(() => {
        if(username){
            axios.get("http://localhost:5000/userinfo/"+username).then(function(response) {
                console.log(response.data);
                setInputs(response.data[0]);
            }).catch(function(error) {
                console.error('Error fetching settings:', error);
            });
        }

    }, [username]);
    

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
  
        axios.put("http://localhost:5000/userupdate/"+username, inputs).then(function(response){
            console.log(response.data);
            window.location.href = '/home';
        });
          
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
                <form className="settingscontainer">
                    <div className="form-group">
                        <input type="text" placeholder="change first name" value={inputs.fname} name="fname" onChange={handleChange} ></input>
                        <input type="text" placeholder="change last name" value={inputs.lname} name="lname" onChange={handleChange} ></input>
                        <input type="text" placeholder="change email" value={inputs.email} name="email" onChange={handleChange} required></input>
                        <input type="text" placeholder="change phone #" value={inputs.phone} name="phone" onChange={handleChange} required></input>
                        <input type="text" value={inputs.password} onChange={handleChange} required></input>
                        <input type="text" placeholder="create new password" name="newpassword" onChange={handleChange} required></input>
                        <button type="submit" name="update" className="save">save</button>
                        <Link to="/home">Cancel</Link>
                        <a></a>
                        <button className="delAccount">Delete Account</button> 
                    </div>
                </form>
            </div>
            </div>


        </div>

    );
}
