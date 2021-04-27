import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { remove } from 'lodash';
import {
  faEdit,
  faHistory,
  faCheck,
  faWindowClose,
  faPlus,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import data from '../../data.json';
class Employees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCards: [],
      deleteModalActive: false,
    };
  }

  edit(id) {
    let cards = this.state.activeCards;
    cards.push(id);
    this.setState({
      activeCards: cards,
    });
  }

  cancelEdit(id) {
    let cards = this.state.activeCards;
    remove(cards, (activeId) => {
      console.log(activeId);
      return id === activeId;
    });

    this.setState({
      activeCards: cards,
    });
  }

  confirmEdit(id) {
    let cards = this.state.activeCards;
    remove(cards, (activeId) => {
      return id === activeId;
    });

    this.setState({
      activeCards: cards,
    });
  }

  addEmployee() {}

  renderCards() {
    let employees = data.rows;
    return employees.map((employee) =>
      this.state.activeCards.includes(employee.id) ? (
        <div className="employees__card" key={employee.id}>
          <div className="employee__name">
            <input
              className="employee__name-input"
              defaultValue={employee.firstName}
              placeholder="First Name"
            />
            <input
              className="employee__name-input"
              defaultValue={employee.lastName}
              placeholder="Last Name"
            />
          </div>
          <div className="employee__rate employee__rate--hourly">
            <h2>Hourly Rate</h2>
            <input
              className="employee__rate-input"
              defaultValue={employee.payRate}
            />
          </div>
          <div className="employee__rate employee__rate--kitchen">
            <h2>Kitchen Rate</h2>
            <input
              className="employee__rate-input"
              defaultValue={employee.kitchenRate}
            />
          </div>
          <button
            className="employee__btn employee__btn--edit"
            onClick={() => this.cancelEdit(employee.id)}
          >
            <FontAwesomeIcon icon={faWindowClose} />
          </button>
          <button
            className="employee__btn employee__btn--history"
            onClick={() => this.confirmEdit(employee.id)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      ) : (
        <div className="employees__card" key={employee.id}>
          <div className="employee__name">
            <h1>{employee.firstName}</h1>
            <h1>{employee.lastName}</h1>
          </div>
          <div className="employee__rate employee__rate--hourly">
            <h2>Hourly Rate</h2>
            <p>{employee.payRate}</p>
          </div>
          <div className="employee__rate employee__rate--kitchen">
            <h2>Kitchen Rate</h2>
            <p>{employee.kitchenRate}</p>
          </div>
          <div className="employee__btns">
            <button
              className="employee__btn employee__btn--edit"
              onClick={() => this.edit(employee.id)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="employee__btn employee__btn--history">
              <FontAwesomeIcon icon={faHistory} />
            </button>
            <button
              onClick={() => this.openModal(employee.id)}
              className="employee__btn employee__btn--delete"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        </div>
      )
    );
  }

  renderAddEmployee() {}

  renderModal() {
    return (
      <div className="employee__modal">
        <div className="employee__modal--content">
          <h3>Are you sure you want to delete this employee?</h3>
          <div className="employee__modal--btns">
            <button
              onClick={() => this.closeModal()}
              className="employee__btn employee__btn--cancel"
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </button>
            <button
              onClick={() => this.confirmDelete()}
              className="employee__btn employee__btn--confirm"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  confirmDelete(id) {
    console.log('Deleted');
    this.setState({
      deleteModalActive: false,
    });
  }

  closeModal() {
    this.setState({
      deleteModalActive: false,
    });
  }

  openModal(id) {
    this.setState({
      deleteModalActive: true,
    });
  }

  render() {
    return (
      <div className="employees">
        {this.renderCards()}
        <button
          className="employees__add-btn"
          onClick={() => this.addEmployee()}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {this.state.deleteModalActive && this.renderModal()}
      </div>
    );
  }
}

export default Employees;
