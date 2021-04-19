import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <h1 className="header__title">Chao Praya Payroll</h1>
        <Link to="/">
          <button className="header__btn">Current Period</button>
        </Link>
        <Link to="/employees">
          <button className="header__btn">Employees</button>
        </Link>
      </header>
    );
  }
}

export default Header;
