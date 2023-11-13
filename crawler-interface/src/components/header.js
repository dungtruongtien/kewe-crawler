import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { logout } from '../services/auth.service';


export function Header() {
  return (
    <div className='header-wrapper'>
      <div className='brand'>
        {/* <Navbar.Brand href="/home">Kewe Crawler</Navbar.Brand> */}
        <Link to={'/home'}>Kewe Crawler</Link>
      </div>
      <div className='avatar-wrapper'>
        <Avatar />
      </div>
    </div>
  )
}

function Avatar() {
  const navigate = useNavigate()
  const handleLogout = () => {
    const userId = localStorage.getItem('userId');
    try {
      logout(userId);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessTokenExpiryIn');
      localStorage.removeItem('userId');
      console.log('navigate login-------');
      navigate('/login');
    } catch (error) {
      navigate('/login');
      // Do nothing, avoid crashing or throwing error to browser
    }
  }

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
          <Image src="/13.jpg" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}
