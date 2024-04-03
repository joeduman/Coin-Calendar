import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from "./home";
import { CgProfile } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import './css/login.css'


export default function LoginPage() {

    return (
        <div className = "page">
        <div className="cover">
            <h1>Login</h1>
            <p className="logintitle">User Name</p>
            <input className = "logininput" type="logintext" placeholder="type your username"/>
            <p className="logintitle">Password</p>
            <input className = "logininput" type="password" placeholder="type your password" />
            <p className="pwtext">Forgot Password?</p>
            <div className="login-btn">Login</div>
            <p className="logintext">Don't Have an Account?</p>
            <a href="signup" className="logintext">SIGN UP</a>
            <a href="home" className="logintext">Go to home page (DEVTOOL)</a>
        </div>
        </div>
    );
  }