import React, { Fragment, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import Logo from './../images/logo/Logo.png';
import TopSearch from './TopSearch';
import './menu.css';


const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: "#ff9900" };
    } else {
        return { color: "#ffffff" };
    }
};

const Menu = ({ history }) => {

    const toggleMenuView = (event)=>{
        event.preventDefault();
        const userMenu = document.getElementById('user-menu')
        if(userMenu.style.visibility === ''){
            return userMenu.style.visibility = 'visible';
        }
        if(userMenu.style.visibility === 'visible'){
            return userMenu.style.visibility = 'hidden';
        }if(userMenu.style.visibility === 'hidden'){
            return userMenu.style.visibility = 'visible';
        }
    }

    return(
    <div className="menu">

        {/* start top bar */}
        <div className="top-bar wow">
            <span className="top-bar-left">
                <img src="/images/icons/call-icon.svg" width="18" /><span>01301997184</span>
                <img src="/images/icons/message-icon.svg" width="18" /><span>support@selften.com</span>

            </span>
            <span className="float-right" >
                <img src="/images/icons/mobile-icon.svg" width="18" /><span>Mobile App is coming</span>
            </span>


        </div>
        {/* end top bar */}


                {/* start menu */}
                <div className="top-menu">
                    {/* Logo */}
                    <div className="logo">
                        <Link
                                className=""
                                style={isActive(history, "/")}
                                to="/"
                        >
                            <img src="/images/Logo.png" width="170" />
                        </Link>
                    </div>

                    {/* Search box top */}
                    <TopSearch />

                    {/* user menu */}
                    <div className="menu-icon" onClick={toggleMenuView}><img src="/images/icons/menu.svg" width="22" /></div>
                    <div className="user-menu" id="user-menu">
                         <li className="nav-item ">
                        <Link
                            className="nav-link one"
                            style={isActive(history, "/shop")}
                            to="/shop"
                        >
                            Shop
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className="nav-link one"
                            style={isActive(history, "/cart")}
                            to="/cart"
                        >
                            Cart{" "}
                            <sup>
                                <small className="cart-badge">{itemTotal()}</small>
                            </sup>
                        </Link>
                    </li>
                    {isAuthenticated() && isAuthenticated().user.role === 0 && (
                        <li className="nav-item">
                            <Link
                                className="nav-link one"
                                style={isActive(history, "/user/dashboard")}
                                to="/user/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {isAuthenticated() && isAuthenticated().user.role === 1 && (
                        <li className="nav-item">
                            <Link
                                className="nav-link one"
                                style={isActive(history, "/admin/dashboard")}
                                to="/admin/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}
                    {isAuthenticated() ?
                    <Fragment>
                        
                        
                        <li className="nav-item">
                            <span
                                className="nav-link one"
                                style={{ cursor: "pointer", color: "#ffffff" }}
                                onClick={() =>
                                    signout(() => {
                                        history.push("/");
                                    })
                                }
                            >
                                Signout
                            </span>
                        </li>
                    </Fragment>
                    

                        :
                        <Fragment>
                            <li className="nav-item">
                                
                                <Link
                                    className="nav-link one"
                                    style={isActive(history, "/user/login")}
                                    to="/user/login"
                                >
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link one"
                                    style={isActive(history, "/user/sign-up")}
                                    to="/user/sign-up"
                                >
                                <img src="/images/icons/user-logged-out.svg" width="18" /> 
                                     Sing up
                                </Link>
                            </li>
                        </Fragment>

                    }
                </div>


            </div>
        {/* end menu */}

        <div className="row less-width">
            <div className="col-md-6">
                <div className="row">
                    <div className="col-md-3">
                        <Link
                            to="/"
                        >
                            <img className="logo" src={Logo} />
                        </Link>
                    </div>
                    {/* <div className="col-md-8">
                        <Search />
                    </div> */}
                </div>
            </div>
            <div className="col-md-5">
                <ul className="nav nav-tabs bg-primary">
                    
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/")}
                            to="/"
                        >
                            Home
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/shop")}
                            to="/shop"
                        >
                            Shop
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/cart")}
                            to="/cart"
                        >
                            Cart{" "}
                            <sup>
                                <small className="cart-badge">{itemTotal()}</small>
                            </sup>
                        </Link>
                    </li>

                    {isAuthenticated() && isAuthenticated().user.role === 0 && (
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                style={isActive(history, "/user/dashboard")}
                                to="/user/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {isAuthenticated() && isAuthenticated().user.role === 1 && (
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                style={isActive(history, "/admin/dashboard")}
                                to="/admin/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {!isAuthenticated() && (
                        <Fragment>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    style={isActive(history, "/signin")}
                                    to="/signin"
                                >
                                    Signin
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    style={isActive(history, "/signup")}
                                    to="/signup"
                                >
                                    Signup
                                </Link>
                            </li>
                        </Fragment>
                    )}

                    {isAuthenticated() && (
                        <li className="nav-item">
                            <span
                                className="nav-link"
                                style={{ cursor: "pointer", color: "#ffffff" }}
                                onClick={() =>
                                    signout(() => {
                                        history.push("/");
                                    })
                                }
                            >
                                Signout
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    </div>
    )
};

export default withRouter(Menu);
