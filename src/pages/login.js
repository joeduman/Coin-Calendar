import HomePage from "./home";
import { CgProfile } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './css/login.css'


export default function LoginPage() {
    const [values, setValues] = useState ({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(values));

    }

    function validation(values){
        
    }

    return (
        <div className = "page">
        <div className="cover">
            <h1>Login</h1>
            <form className="loginTitle" action="" onSubmit={handleSubmit}>
            <p className="logintitle">User Name</p>
            <input className = "logininput" type="logintext" placeholder="type your username"
            onChange={handleInput} name="username"/>
            <p className="logintitle">Password</p>
            <input className = "logininput" type="password" placeholder="type your password" 
            onChange={handleInput} name="password"/>
            </form>
            <p className="pwtext">Forgot Password?</p>

            <button type='submit' className="login-btn">Login</button>

            <p className="logintext">Don't Have an Account?</p>
            <Link to="/signup" className="logintext">SIGN UP</Link>
            <Link to="/home" className="logintext">Go to home page (DEVTOOL)</Link>
        </div>
        </div>
    );
  }