import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getPayPeriods,
  getDates,
  submit,
} from '../../redux/actions/periodActions';
import {
  getDataFromAWS
} from '../../redux/actions/submitActions';
import {
  getEmployees
} from '../../redux/actions/employeeActions';
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
        let length = this.props.dates.length - 1;
  
        this.setState({
          periods: this.props.periods,
          periodIndex: length,
          dates: this.props.dates,
          yearlyDates: Object.keys(this.props.yearlyDates),
          isCurrent: true,
        })

        if(this.checkDate()) {
          this.props.getEmployees().then(employees => {
            this.generateTemplate(employees);
          })
        } else {
          this.setState({
            employees: this.props.periods[this.props.dates[length]],
          })
        }
      });
    });
  }

  generateTemplate(employees) {
    let dates = this.state.dates;
    let currentIndex = this.state.periodIndex;
    // dateOfFocus is the last date that had data from the db
    let dateOfFocus = dates[currentIndex]

    // Find the index of the date of focus
    let yearlyDates = this.state.yearlyDates;
    let yearlyDatesIndex = yearlyDates.findIndex(x => x === dateOfFocus)

    // Retrieve data for the next upcoming index, the upcoming period after the date of focus
    let yearlyDatesDetails = this.props.yearlyDates;
    let nextDateDetails = yearlyDatesDetails[yearlyDates[yearlyDatesIndex + 1]]

    // Push onto dates arr the new upcoming date of focus we are generating
    dates.push(nextDateDetails["periodStart"]);

    let newEmployees = employees.map((employee) => {
      let { addedAt, modifiedAt, ...newEmployee } = employee;

      newEmployee[KITCHEN_DAYS] = 0;
      newEmployee[CALCULATED_KITCHEN_HOURS] = '00:00';
      newEmployee[SERVER_HOURS] = '00:00';
      newEmployee[SICK_HOURS] = '00:00';
      newEmployee[TOTAL_HOURS] = '00:00';
      newEmployee[TOTAL_HOURS_ROUNDED] = '00:00';
      newEmployee[TIPS] = 0;
      newEmployee[PERIOD_START] = nextDateDetails["periodStart"];
      newEmployee[PERIOD_END] = nextDateDetails["periodEnd"];
      newEmployee[CHECK_DATE] = nextDateDetails["checkDate"];

      return newEmployee;
    });

    // Add list of new employees to updated periods array
    let updatedPeriodsArr = this.state.periods;
    updatedPeriodsArr[nextDateDetails["periodStart"]] = newEmployees;

    // Update state with new contents
    this.setState({
      periods: updatedPeriodsArr,
      periodIndex: this.state.periodIndex + 1,
      dates: dates,
      employees: newEmployees,
      isCurrent: true,
    });
  }

  checkDate() {
    let dates = this.state.dates;
    let currentIndex = this.state.periodIndex;
    // dateOfFocus is the last date that had data from the db
    let dateOfFocus = dates[currentIndex]

    // Find the index of the date of focus
    let yearlyDates = this.state.yearlyDates;
    let yearlyDatesIndex = yearlyDates.findIndex(x => x === dateOfFocus)

    // Retrieve data for the next upcoming index, the upcoming period after the date of focus
    let yearlyDatesDetails = this.props.yearlyDates;
    let nextDateDetails = yearlyDatesDetails[yearlyDates[yearlyDatesIndex + 1]]

    // Get the upcoming date of focus
    let upcomingDateOfFocus = nextDateDetails["periodStart"]

    // Create a date object for the upcoming generate trigger date and set timezone
    let generateDate = new Date(nextDateDetails["periodEnd"])
    generateDate = new Date(generateDate.getTime() + generateDate.getTimezoneOffset() * 60000)
    generateDate.setHours(0, 0, 0, 0);

    // Fetch todays date
    let today = new Date()

    // If we are past the generateDate, and the upcoming date of focus is not already in our data set
    if (
      today.getTime() >= generateDate.getTime() &&
      !has(this.state.periods, upcomingDateOfFocus)
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
    alert('Employee data has been submitted');

    const { employees } = this.state;
    const previousDate = this.state.dates[this.state.periodIndex - 1];
    const previousEmployees = (typeof this.state.periods[previousDate] === "undefined") ? [] : this.state.periods[previousDate];

    // Create a copy of employees as a Set, we dont want any dups!
    let employeesToSubmit = new Set([...employees]);

    // Set default values that all employees are not new and not removed
    employeesToSubmit.forEach((employee) => {
      employee['isNew'] = false
      employee['isRemoved'] = false
    });

    // Find additions and removals
    const additionsToEmployees = employees.filter(
      ({ id: id1 }) => !previousEmployees.some(({ id: id2 }) => id2 === id1)
    );
    const removalsFromEmployees = previousEmployees.filter(
      ({ id: id1 }) => !employees.some(({ id: id2 }) => id2 === id1)
    );

    // for every new addition, set isNew true and add to employeesToSubmit
    additionsToEmployees.map((employee) => {
      employee['isNew'] = true
      employee['isRemoved'] = false
      employeesToSubmit.add(employee)
    });

    // for every removal, set isRemoved to true
    removalsFromEmployees.map((employee) => {
      employee['isNew'] = false
      employee['isRemoved'] = true
      employeesToSubmit.add(employee)
    });

    this.props.submit(Array.from(employeesToSubmit));

    // TODO
    // Add an isSubmited status to recognize state
    // Render a modal after a submit
    // Modal can have loading state as it tries and retries to fetch file at S3
    // On retrieval of file
    // Render in pdf viewer within the modal?
    // Button to cancel
    // Button to email
    // Button to download?
    // On any of these button clicks, do the action then set isSubmitted to false

    // While submit has been clicked, gray out until response has returned ~20 secs

    // Fetches data from aws
    // console.log("attempt to get from aws")
    // getDataFromAWS("chao-praya-time-sheets", "2021-05-01-TimeSheet.pdf").then((res) => console.log(res))

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

export default connect(mapStateToProps, { getPayPeriods, getDates, submit, getEmployees })(
  CurrentPeriod
);
