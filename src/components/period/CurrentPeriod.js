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
import { formatDate } from './helpers';
import { has } from 'lodash';

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
    this.initializePeriod();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.periods !== this.props.periods) {
      console.log('Update: Periods');
      this.setState({
        periods: this.props.periods,
      });
    }
    if (prevProps.dates !== this.props.dates) {
      console.log('Update: Dates');
      this.setState({
        dates: this.props.dates,
      });
    }
  }

  initializePeriod() {
    this.props.getPayPeriods().then(() => {
      this.props.getDates().then(() => {
        console.log("here in initialize")
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
            console.log("after setting state?")
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
    let index = this.state.periodIndex;
    let yearlyDates = this.state.yearlyDates;
    let newPeriodDate = yearlyDates[index + 1];
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

    console.log("setting new state")
    this.setState({
      periods: newPeriods,
      periodIndex: this.state.periodIndex + 1,
      dates: newDates,
      employees: newEmployees,
      isCurrent: true,
    }, 
    () => { 
      console.log("done setting state") 
    });
  }

  checkDate() {
    let currentIndex = this.state.periodIndex;
    let prevDates = this.state.dates;
    let yearlyDates = this.state.yearlyDates;
    let yearlyDatesDetails = this.props.yearlyDates;

    let today = new Date();
    let prevEndDate = new Date(this.getPeriodEnd(prevDates[currentIndex]));
    let currentStartDate =
      yearlyDatesDetails[yearlyDates[currentIndex + 1]].periodStart;
    let currentEndDate = new Date(
      yearlyDatesDetails[yearlyDates[currentIndex + 1]].periodEnd
    );

    prevEndDate = new Date(
      prevEndDate.getTime() + prevEndDate.getTimezoneOffset() * 60000
    );
    currentEndDate = new Date(
      currentEndDate.getTime() + currentEndDate.getTimezoneOffset() * 60000
    );

    prevEndDate.setHours(0, 0, 0, 0);
    currentEndDate.setHours(0, 0, 0, 0);

    console.log(today)
    console.log(prevEndDate)
    console.log(currentEndDate)
    console.log(!has(this.state.periods, currentStartDate))

    if (
      today.getTime() >= prevEndDate.getTime() &&
      today.getTime() <= currentEndDate.getTime() &&
      !has(this.state.periods, currentStartDate)
    ) {
      return true;
    }
    return false;
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

    const { employees } = this.state;
    const previousDate = this.state.dates[this.state.periodIndex - 1];
    const previousEmployees = this.state.periods[previousDate];

    let employeesToSubmit = [...employees];
    employeesToSubmit.map((employee) => (employee['isNew'] = false));

    if (previousEmployees.length !== employees.length) {
      const differences = employees.filter(
        ({ id: id1 }) => !previousEmployees.some(({ id: id2 }) => id2 === id1)
      );
      const commons = employees.filter(({ id: id1 }) =>
        previousEmployees.some(({ id: id2 }) => id2 === id1)
      );

      differences.map((employee) => (employee['isNew'] = true));

      employeesToSubmit = commons.concat(differences);
    }

    this.props.submit(employeesToSubmit);
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
    if (employees.length > 0) {
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
    } else {
      console.error('No employees retrieved from db');
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
                {formatDate(this.state.dates[this.state.periodIndex]) + ' - '}
                {formatDate(
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
