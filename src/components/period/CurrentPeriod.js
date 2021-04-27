import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPayPeriods } from '../../redux/actions/periodActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      periodIndex: this.props.dates.length - 1,
      employees: this.props.periods[
        this.props.dates[this.props.dates.length - 1]
      ],
    };
  }

  componentDidMount() {
    this.props.getPayPeriods();
  }

  renderEndDate(date) {
    let result = new Date(date);
    result.setDate(result.getDate() + 15);
    return this.formatDate(result);
  }

  formatDate(date) {
    let selectedDate = new Date(date);

    // Since date was one day off when converted to date object, must offset to local time
    selectedDate = new Date(
      selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
    );
    console.log(selectedDate);
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();
    let year = selectedDate.getFullYear();
    return MONTHS[month - 1] + ` ${day},` + ` ${year}`;
  }

  setPrevPeriod() {
    if (this.state.periodIndex > 0) {
      let index = this.state.periodIndex - 1;
      let period = this.props.dates[index];
      console.log(period);
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
      console.log(period);
      this.setState({
        periodIndex: index,
        employees: this.props.periods[period],
      });
    }
  }

  renderTableHeaders() {
    const headers = [
      'First Name',
      'Last Name',
      'Pay Rate',
      'Kitchen Rate',
      'Kitchen Days',
      'Kitchen Hours',
      'Regular Hours',
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
    return (
      <tbody>
        {employees.map((employee, index) => (
          <tr key={index} className="period__trow">
            <td>{employee.firstName}</td>
            <td>{employee.lastName}</td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.hourlyRate}
              />
            </td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.kitchenDayRate}
              />
            </td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.kitchenDays}
              />
            </td>
            <td>{employee.calculatedKitchenHours}</td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.serverHours}
              />
            </td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.sickHours}
              />
            </td>
            <td>{employee.totalHours}</td>
            <td>{employee.totalHoursRounded}</td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.tips}
              />
            </td>
            <td>
              <button className="period__history">
                <FontAwesomeIcon icon={faHistory} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    );
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
            <h2 className="period__date">
              {this.formatDate(this.props.dates[this.state.periodIndex]) +
                ' - '}
              {this.renderEndDate(this.props.dates[this.state.periodIndex])}
            </h2>
            <button
              className="period__arrow"
              onClick={() => this.setNextPeriod()}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        </header>
        <table className="period__table" cellSpacing={0}>
          {this.renderTableHeaders()}
          {this.renderTableRows()}
        </table>
        <button className="period__submit">Submit</button>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  dates: Object.keys(state.period.periods),
  periods: state.period.periods,
});

export default connect(mapStateToProps, { getPayPeriods })(CurrentPeriod);
