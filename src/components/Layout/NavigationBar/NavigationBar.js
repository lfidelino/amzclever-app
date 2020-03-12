import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import logo from '../../../assets/images/amzclever-logo.png';
import styles from './NavigationBar.module.css';

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">
        <img
          src={logo}
          width="150"
          height="40"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
      </Navbar.Brand>
    </Navbar>
  );
}

export default NavigationBar;
