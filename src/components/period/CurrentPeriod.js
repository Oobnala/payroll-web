import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getPayPeriods,
  getDates,
  submit,
  lock,
  unlock,
} from '../../redux/actions/periodActions';
import { getDataFromAWS, emailPDF } from '../../redux/actions/submitActions';
import { getEmployees } from '../../redux/actions/employeeActions';
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
  TOTAL_PAY_NEEDED,
  CASH_PERCENTAGE,
  CASH_PAYOUT,
  CHECK_PAYOUT,
  MISC,
} from './properties';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PeriodRow from './PeriodRows';
import Calculator from './Calculator';
import SubmitModal from './SubmitModal';
import LoadingModal from './LoadingModal';
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from './helpers';
import { has } from 'lodash';

let bucketName;
if (typeof process.env.REACT_APP_AWS_BUCKET_NAME === 'undefined') {
  console.error(
    'ENV VAR BUCKET NAME NOT SET',
    process.env.REACT_APP_AWS_BUCKET_NAME
  );
} else {
  bucketName = process.env.REACT_APP_AWS_BUCKET_NAME;
}

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
      submitLoading: false,
      isSubmitted: false,
      pdfURL: '',
      lockedEmployees: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateEmployee = this.handleUpdateEmployee.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    this.initializePeriod();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.periods !== this.props.periods) {
      this.setState({
        periods: this.props.periods,
      });
    }
    if (prevProps.dates !== this.props.dates) {
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
        });

        if (this.checkDate()) {
          this.props.getEmployees().then((employees) => {
            this.generateTemplate(employees);
          });
        } else {
          // Employees with data, fetched from db
          const dbEmployees = this.props.periods[this.props.dates[length]];
          this.props.getEmployees().then((employees) => {
            // Merge in employee blanks, then set state to merged array
            this.setState({
              employees: this.mergeEmployeeBlanks(employees, dbEmployees),
              lockedEmployees: dbEmployees.map((employee) => employee.id),
            });
          });
        }
      });
    });
  }

  mergeEmployeeBlanks(employees, dbEmployees) {
    // Build entire array of blank employees
    let emptyEmployees = employees.map((employee) => {
      let { addedAt, modifiedAt, ...newEmployee } = employee;
      newEmployee[KITCHEN_DAYS] = 0;
      newEmployee[CALCULATED_KITCHEN_HOURS] = '00:00';
      newEmployee[SERVER_HOURS] = '00:00';
      newEmployee[SICK_HOURS] = '00:00';
      newEmployee[TOTAL_HOURS] = '00:00';
      newEmployee[TOTAL_HOURS_ROUNDED] = '00:00';
      newEmployee[TIPS] = 0;
      newEmployee[PERIOD_START] = dbEmployees[0].periodStart;
      newEmployee[PERIOD_END] = dbEmployees[0].periodEnd;
      newEmployee[CHECK_DATE] = dbEmployees[0].checkDate;
      newEmployee[TOTAL_PAY_NEEDED] = 0;
      newEmployee[CASH_PERCENTAGE] = 0;
      newEmployee[CASH_PAYOUT] = 0;
      newEmployee[CHECK_PAYOUT] = 0;
      newEmployee[MISC] = '00:00';

      return newEmployee;
    });

    // Merge two arrays together to have both empty and non empty
    let mergedEmployees = emptyEmployees.map((blankEmployee) => {
      return Object.assign(
        blankEmployee,
        dbEmployees.find((dbEmployee) => {
          return dbEmployee && blankEmployee.id === dbEmployee.id;
        })
      );
    });

    return mergedEmployees;
  }

  generateTemplate(employees) {
    let dates = this.state.dates;
    let currentIndex = this.state.periodIndex;
    // dateOfFocus is the last date that had data from the db
    let dateOfFocus = dates[currentIndex];

    // Find the index of the date of focus
    let yearlyDates = this.state.yearlyDates;
    let yearlyDatesIndex = yearlyDates.findIndex((x) => x === dateOfFocus);

    // Retrieve data for the next upcoming index, the upcoming period after the date of focus
    let yearlyDatesDetails = this.props.yearlyDates;
    let nextDateDetails = yearlyDatesDetails[yearlyDates[yearlyDatesIndex + 1]];

    // Push onto dates arr the new upcoming date of focus we are generating
    dates.push(nextDateDetails['periodStart']);

    let newEmployees = employees.map((employee) => {
      let { addedAt, modifiedAt, ...newEmployee } = employee;

      newEmployee[KITCHEN_DAYS] = 0;
      newEmployee[CALCULATED_KITCHEN_HOURS] = '00:00';
      newEmployee[SERVER_HOURS] = '00:00';
      newEmployee[SICK_HOURS] = '00:00';
      newEmployee[TOTAL_HOURS] = '00:00';
      newEmployee[TOTAL_HOURS_ROUNDED] = '00:00';
      newEmployee[TIPS] = 0;
      newEmployee[PERIOD_START] = nextDateDetails['periodStart'];
      newEmployee[PERIOD_END] = nextDateDetails['periodEnd'];
      newEmployee[CHECK_DATE] = nextDateDetails['checkDate'];
      newEmployee[TOTAL_PAY_NEEDED] = 0;
      newEmployee[CASH_PERCENTAGE] = 0;
      newEmployee[CASH_PAYOUT] = 0;
      newEmployee[CHECK_PAYOUT] = 0;
      newEmployee[MISC] = '00:00';

      return newEmployee;
    });

    // Add list of new employees to updated periods array
    let updatedPeriodsArr = this.state.periods;
    updatedPeriodsArr[nextDateDetails['periodStart']] = newEmployees;

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
    let dateOfFocus = dates[currentIndex];

    // Find the index of the date of focus
    let yearlyDates = this.state.yearlyDates;
    let yearlyDatesIndex = yearlyDates.findIndex((x) => x === dateOfFocus);

    // Retrieve data for the next upcoming index, the upcoming period after the date of focus
    let yearlyDatesDetails = this.props.yearlyDates;
    let nextDateDetails = yearlyDatesDetails[yearlyDates[yearlyDatesIndex + 1]];

    // Get the upcoming date of focus
    let upcomingDateOfFocus = nextDateDetails['periodStart'];

    // Create a date object for the upcoming generate trigger date and set timezone
    let generateDate = new Date(nextDateDetails['periodEnd']);
    generateDate = new Date(
      generateDate.getTime() + generateDate.getTimezoneOffset() * 60000
    );
    generateDate.setHours(0, 0, 0, 0);

    // Fetch todays date
    let today = new Date();

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
        lockedEmployees: this.state.periods[period].map(
          (employee) => employee.id
        ),
      });
    }
  }

  setNextPeriod() {
    if (this.state.periodIndex < this.state.dates.length - 1) {
      let nextIndex = this.state.periodIndex + 1;
      let prevIndex = this.state.periodIndex;
      let period = this.state.dates[nextIndex];
      let prevPeriod = this.state.dates[prevIndex];

      this.setState(
        {
          periodIndex: nextIndex,
          employees: this.mergeEmployeeBlanks(
            this.state.periods[prevPeriod],
            this.state.periods[period]
          ),
          lockedEmployees: this.state.periods[period].map(
            (employee) => employee.id
          ),
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

  handleCloseModal() {
    this.setState({
      isSubmitted: false,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      submitLoading: true,
    });

    const { employees } = this.state;
    const previousDate = this.state.dates[this.state.periodIndex - 1];
    const previousEmployees =
      typeof this.state.periods[previousDate] === 'undefined'
        ? []
        : this.state.periods[previousDate];

    // Create a copy of employees as a Set, we dont want any dups!
    let employeesToSubmit = new Set([...employees]);

    console.log('emp', employeesToSubmit);

    // Set default values that all employees are not new and not removed
    employeesToSubmit.forEach((employee) => {
      employee['isNew'] = false;
      employee['isRemoved'] = false;
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
      employee['isNew'] = true;
      employee['isRemoved'] = false;
      employeesToSubmit.add(employee);
    });

    // for every removal, set isRemoved to true
    removalsFromEmployees.map((employee) => {
      employee['isNew'] = false;
      employee['isRemoved'] = true;
      employeesToSubmit.add(employee);
    });

    // this.props.submit(Array.from(employeesToSubmit));

    // Fetches data from aws
    console.log('attempt to get from aws');
    getDataFromAWS(
      bucketName,
      `${this.state.dates[this.state.periodIndex]}-TimeSheet.pdf`
    ).then((res) => {
      console.log('res from aws', res);
      let blob = new Blob([res], { type: 'application/pdf' });
      let blobURL = URL.createObjectURL(blob);
      this.setState({
        pdfURL: blobURL,
        isSubmitted: true,
        submitLoading: false,
      });
    });
  }

  renderTableHeaders() {
    const headers = [
      'First Name',
      'Last Name',
      'Pay Rate',
      'Kitchen Rate',
      'Kitchen Days',
      'Total Pay Needed',
      'Cash Percentage',
      'Cash Payout',
      'Check Payout',
      'Misc',
      'Kitchen Hours',
      'Server Hours',
      'Sick Hours',
      'Total',
      'Total Hours Rounded',
      'Tips',
      'Lock Status',
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

  sortByFirstName(a, b) {
    const nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
    const nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  renderTableRows() {
    let employees = this.state.employees;
    if (employees.length > 0) {
      return (
        <tbody>
          {employees.sort(this.sortByFirstName).map((employee, index) => (
            <PeriodRow
              key={index}
              employee={employee}
              index={index}
              handleUpdateEmployee={this.handleUpdateEmployee}
              lock={this.props.lock}
              unlock={this.props.unlock}
              isCurrent={this.state.isCurrent}
              lockedEmployees={this.state.lockedEmployees}
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
      <div className="period__container">
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
        {/* <Calculator /> */}
        {this.state.submitLoading && <LoadingModal />}
        {this.state.isSubmitted && (
          <SubmitModal
            startDateUnformatted={this.state.dates[this.state.periodIndex]}
            startDate={formatDate(this.state.dates[this.state.periodIndex])}
            endDate={formatDate(
              this.getPeriodEnd(this.state.dates[this.state.periodIndex])
            )}
            emailPDF={this.props.emailPDF}
            pdf={this.state.pdfURL}
            handleCloseModal={this.handleCloseModal}
          />
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

export default connect(mapStateToProps, {
  getPayPeriods,
  getDates,
  submit,
  getEmployees,
  emailPDF,
  lock,
  unlock,
})(CurrentPeriod);
