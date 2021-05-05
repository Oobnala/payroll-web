import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getPayPeriods,
  getDates,
  submit,
} from '../../redux/actions/periodActions';
import {
  KITCHEN_DAYS,
  CALCULATED_KITCHEN_HOURS,
  SERVER_HOURS,
  SICK_HOURS,
  TOTAL_HOURS,
  TOTAL_HOURS_ROUNDED,
  TIPS,
  PERIOD_START,
  PERIOD_END,
  CHECK_DATE,
} from './properties';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PeriodRow from './PeriodRows';
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

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
      periods: {},
      periodIndex: 0,
      employees: [],
      dates: [],
      yearlyDates: [],
      isCurrent: true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateEmployee = this.handleUpdateEmployee.bind(this);
  }

  componentDidMount() {
    this.props.getPayPeriods().then(() => {
      this.props.getDates().then(() => {
        let length = this.props.dates.length - 1;
        this.setState(
          {
            periods: this.props.periods,
            periodIndex: length,
            employees: this.props.periods[this.props.dates[length]],
            dates: this.props.dates,
            yearlyDates: Object.keys(this.props.yearlyDates),
            isCurrent: true,
          },
          () => {
            if (this.checkDate()) {
              this.generateTemplate();
            }
          }
        );
      });
    });
  }

  generateTemplate() {
    let newDates = this.state.dates;
    let newPeriodDate = this.state.yearlyDates[this.state.periodIndex + 1];
    newDates.push(newPeriodDate);

    let newEmployees = this.props.employees.map((employee) => {
      let { addedAt, modifiedAt, ...newEmployee } = employee;
      newEmployee[KITCHEN_DAYS] = 0;
      newEmployee[CALCULATED_KITCHEN_HOURS] = '00:00';
      newEmployee[SERVER_HOURS] = '00:00';
      newEmployee[SICK_HOURS] = '00:00';
      newEmployee[TOTAL_HOURS] = '00:00';
      newEmployee[TOTAL_HOURS_ROUNDED] = '00:00';
      newEmployee[TIPS] = 0;
      newEmployee[PERIOD_START] = newPeriodDate;
      newEmployee[PERIOD_END] = this.getPeriodEnd(newPeriodDate);
      newEmployee[CHECK_DATE] = this.props.yearlyDates[newPeriodDate].checkDate;
      return newEmployee;
    });

    let newPeriods = this.state.periods;
    newPeriods[newPeriodDate] = newEmployees;

    this.setState({
      periods: newPeriods,
      periodIndex: this.state.periodIndex + 1,
      dates: newDates,
      employees: newEmployees,
      isCurrent: true,
    });
  }

  checkDate() {
    let today = new Date();
    let endDate = new Date(
      this.getPeriodEnd(this.state.dates[this.state.periodIndex])
    );
    endDate = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (today.getTime() === endDate.getTime()) {
      return true;
    }
    return false;
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
      let period = this.state.dates[index];
      this.setState({
        periodIndex: index,
        employees: this.state.periods[period],
        isCurrent: false,
      });
    }
  }

  setNextPeriod() {
    if (this.state.periodIndex < this.state.dates.length - 1) {
      let index = this.state.periodIndex + 1;
      let period = this.state.dates[index];
      this.setState(
        {
          periodIndex: index,
          employees: this.state.periods[period],
        },
        () => {
          if (this.state.periodIndex === this.state.dates.length - 1) {
            this.setState({
              isCurrent: true,
            });
          }
        }
      );
    }
  }

  getPeriodEnd(startDate) {
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
    this.props.submit(this.state.employees);
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
              isCurrent={this.state.isCurrent}
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
                {this.formatDate(this.state.dates[this.state.periodIndex]) +
                  ' - '}
                {this.formatDate(
                  this.getPeriodEnd(this.state.dates[this.state.periodIndex])
                )}
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
            {this.state.isCurrent && (
              <button type="submit" className="period__submit">
                Submit
              </button>
            )}
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
  employees: state.employee.employees,
});

export default connect(mapStateToProps, { getPayPeriods, getDates, submit })(
  CurrentPeriod
);
