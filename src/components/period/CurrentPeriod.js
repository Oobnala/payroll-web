import React, { Component } from 'react';
import data from '../../data.json';

class CurrentPeriod extends Component {
  renderTableHeaders() {
    const headers = [
      'First Name',
      'Last Name',
      'Pay Rate',
      'Kitchen Rate',
      'Kitchen Hours',
      'Kitchen Days',
      'Regular Hours',
      'Sick Hours',
      'Total',
      'Total Rounded Nearest',
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
    let employees = data.rows;
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
                defaultValue={employee.payRate}
              />
            </td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.kitchenRate}
              />
            </td>
            <td>{employee.kitchenDays}</td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.kitchenHours}
              />
            </td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.regularHours}
              />
            </td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.sickHours}
              />
            </td>
            <td>{employee.totalRoundedNearest}</td>
            <td>{employee.totalRoundedUp}</td>
            <td>
              <input
                className="period__tinput"
                type="text"
                defaultValue={employee.tips}
              />
            </td>
            <td>History</td>
          </tr>
        ))}
      </tbody>
    );
  }

  render() {
    return (
      <div className="period">
        <header className="period__header">
          <h1 className="period__title">Current Period</h1>
          <h2 className="period__date">
            february 01, 2021 - february 15, 2021
          </h2>
        </header>
        <table className="period__table" cellSpacing={0}>
          {this.renderTableHeaders()}
          {this.renderTableRows()}
        </table>
      </div>
    );
  }
}

export default CurrentPeriod;
