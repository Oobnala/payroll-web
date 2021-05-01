import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPayPeriods, getDates } from '../../redux/actions/periodActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PeriodRow from './PeriodRows';
import {
  faCaretRight,
  faCaretLeft,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class CurrentPeriod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periodIndex: 0,
      employees: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateEmployee = this.handleUpdateEmployee.bind(this);
  }

  componentDidMount() {
    let length = this.props.dates.length - 1;
    this.props.getPayPeriods().then(() => {
      this.props.getDates();
      this.setState({
        periodIndex: length,
        employees: this.props.periods[this.props.dates[length]],
      });
    });
  }

  formatDate(date) {
    let selectedDate = new Date(date);

    // Since date was one day off when converted to date object, must offset to local time
    selectedDate = new Date(
      selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
    );
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();
    let year = selectedDate.getFullYear();
    return MONTHS[month - 1] + ` ${day},` + ` ${year}`;
  }

  setPrevPeriod() {
    if (this.state.periodIndex > 0) {
      let index = this.state.periodIndex - 1;
      let period = this.props.dates[index];
      this.setState({
        periodIndex: index,
        employees: this.props.periods[period],
      });
    }
  }

  setNextPeriod() {
    if (this.state.periodIndex < this.props.dates.length - 1) {
      let index = this.state.periodIndex + 1;
      let period = this.props.dates[index];
      this.setState({
        periodIndex: index,
        employees: this.props.periods[period],
      });
    }
  }

  getPeriodEnd() {
    let startDate = this.props.dates[this.state.periodIndex];
    return this.props.yearlyDates[startDate].periodEnd;
  }

  handleUpdateEmployee(updatedEmployee, index) {
    let employees = this.state.employees;
    employees[index] = updatedEmployee;

    this.setState({
      employees: employees,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.employees);
  }

  renderTableHeaders() {
    const headers = [
      'First Name',
      'Last Name',
      'Pay Rate',
      'Kitchen Rate',
      'Kitchen Days',
      'Kitchen Hours',
      'Server Hours',
      'Sick Hours',
      'Total',
      'Total Hours Rounded',
      'Tips',
      'History',
    ];
    return (
      <thead>
        <tr>
          {headers.map((header) => (
            <th className="period__theader" key={header}>
              <p>{header}</p>
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  renderTableRows() {
    let employees = this.state.employees;
    if (employees) {
      return (
        <tbody>
          {employees.map((employee, index) => (
            <PeriodRow
              key={index}
              employee={employee}
              index={index}
              handleUpdateEmployee={this.handleUpdateEmployee}
            />
          ))}
        </tbody>
      );
    }
  }

  render() {
    return (
      <div className="period">
        <header className="period__header">
          <div className="period__date-change">
            <button
              className="period__arrow"
              onClick={() => this.setPrevPeriod()}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            {this.state.employees.length === 0 ? (
              <h2 className="period__date">Loading Date...</h2>
            ) : (
              <h2 className="period__date">
                {this.formatDate(this.props.dates[this.state.periodIndex]) +
                  ' - '}
                {this.formatDate(this.getPeriodEnd())}
              </h2>
            )}

            <button
              className="period__arrow"
              onClick={() => this.setNextPeriod()}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        </header>
        {this.state.employees.length === 0 ? (
          <div className="period__load">Loading....</div>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <table className="period__table" cellSpacing={0}>
              {this.renderTableHeaders()}
              {this.renderTableRows()}
            </table>
            <button type="submit" className="period__submit">
              Submit
            </button>
          </form>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  dates: Object.keys(state.period.periods),
  yearlyDates: state.period.dates,
  periods: state.period.periods,
});

export default connect(mapStateToProps, { getPayPeriods, getDates })(
  CurrentPeriod
);
