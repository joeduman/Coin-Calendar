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
            <p className="logintitle">email</p>
            <input className = "logininput" type="password" placeholder="type your email" />
            <p className="logintitle">Password</p>
            <input className = "logininput" type="password" placeholder="type your password" />
            <p className="logintitle">Confirm Password</p>
            <input className = "logininput" type="password" placeholder="retype your password" />
            <div className="login-btn">Sign Up</div>
            <p className="logintext">Already Have an Account? <a href="/">Login</a> </p>
            <a href="home" className="logintext">Go to home page (DEVTOOL)</a>
        </div>
        </div>
    );
  }