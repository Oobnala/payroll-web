import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btns: [
        { route: '/', name: 'Period' },
        { route: '/employees', name: 'Employees' },
      ],
      activeBtnIndex: 0,
    };
  }
  componentDidMount() {
    let activeIndex = parseInt(sessionStorage.getItem('activeBtnIndex'));

    if (activeIndex) {
      this.setState({
        activeBtnIndex: activeIndex,
      });
    }
  }

  setActiveBtn(index) {
    sessionStorage.setItem('activeBtnIndex', index);
    this.setState({
      activeBtnIndex: index,
    });
  }

  render() {
    return (
      <header className="header">
        <h1 className="header__title">Chao Praya Payroll</h1>
        {this.state.btns.map((btn, index) => {
          return (
            <Link
              key={index}
              to={btn.route}
              onClick={() => this.setActiveBtn(index)}
            >
              <button
                className={
                  index === this.state.activeBtnIndex
                    ? 'header__btn header__btn--active'
                    : 'header__btn header__btn--inactive'
                }
              >
                {btn.name}
              </button>
            </Link>
          );
        })}
      </header>
    );
  }
}

export default Header;
