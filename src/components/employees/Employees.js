import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { remove } from 'lodash';
import { getEmployees, addEmployee } from '../../redux/actions/employeeActions';
import EmployeeCard from './EmployeeCard';
import EmployeeEdit from './EmployeeEdit';
import {
  faCheck,
  faWindowClose,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
class Employees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: this.props.employees,
      activeCards: [],
      deleteModalActive: false,
    };
    this.edit = this.edit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.confirmEdit = this.confirmEdit.bind(this);
  }

  componentDidMount() {
    this.props.getEmployees();
  }

  edit(index) {
    let cards = this.state.activeCards;
    cards.push(index);
    this.setState({
      activeCards: cards,
    });
  }

  cancelEdit(index) {
    let cards = this.state.activeCards;
    remove(cards, (activeIndex) => {
      return index === activeIndex;
    });

    this.setState({
      activeCards: cards,
    });
  }

  confirmEdit(index) {
    let cards = this.state.activeCards;
    remove(cards, (activeIndex) => {
      return index === activeIndex;
    });

    this.setState({
      activeCards: cards,
    });
  }

  renderCards() {
    return this.state.employees.map((employee, index) =>
      this.state.activeCards.includes(index) ? (
        <EmployeeEdit
          key={index}
          index={index}
          employee={employee}
          confirmEdit={this.confirmEdit}
          cancelEdit={this.cancelEdit}
          openModal={this.openModal}
        />
      ) : (
        <EmployeeCard
          key={index}
          index={index}
          employee={employee}
          edit={this.edit}
        />
      )
    );
  }

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

  addEmployee() {
    let newEmployee = {
      firstName: '',
      lastName: '',
      hourlyRate: 0,
      kitchenDayRate: 0,
    };

    let updatedEmployees = this.state.employees;
    updatedEmployees.push(newEmployee);

    let active = this.state.activeCards;
    active.push(updatedEmployees.length - 1);

    this.setState({
      employees: updatedEmployees,
      activeCards: active,
    });
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

const mapStateToProps = (state) => ({
  employees: state.employee.employees,
});

export default connect(mapStateToProps, { getEmployees, addEmployee })(
  Employees
);
