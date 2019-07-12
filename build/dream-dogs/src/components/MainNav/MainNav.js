import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './MainNav.css';
import logo from '../../images/dog.svg';

function MainNav() {
    return (
        <>
            <Link to='/' className='nav-title'><img className='icon' src={logo} alt='dream dogs icon/logo'></img><span className='title'>Dream Dogs</span></Link>
            <Menu>
                <Link to='/' id="home" className="menu-item">Home</Link><br />
                <Link id="demo" className="menu-item" to='/posts'>Demo</Link><br />
                <Link id="signup" className="menu-item" to='/signup'>Sign Up</Link><br />
                <Link id="login" className="menu-item" to='/login'>Log In</Link> 
            </Menu>
        </>   
      );
}

export default MainNav;