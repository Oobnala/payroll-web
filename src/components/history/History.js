import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getHistory } from '../../redux/actions/historyActions';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
  }

  componentDidMount() {
    this.props.getHistory(this.props.match.params.id);
    console.log(this.props.history);
  }

  renderTableHeaders() {
    const headers = [
      'Period Start',
      'Period End',
      'Pay Rate',
      'Kitchen Rate',
      'Kitchen Days',
      'Kitchen Hours',
      'Server Hours',
      'Sick Hours',
      'Total',
      'Total Hours Rounded',
      'Tips',
    ];
    return (
      <thead>
        <tr>
          {headers.map((header) => (
            <th className="history__theader" key={header}>
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
            // <PeriodRow
            //   key={index}
            //   employee={employee}
            //   index={index}
            //   handleUpdateEmployee={this.handleUpdateEmployee}
            //   isCurrent={this.state.isCurrent}
            // />
            <div></div>
          ))}
        </tbody>
      );
    }
  }

  render() {
    return (
      <div className="history">
        <header className="history__header">Header</header>
        <table className="history__table">{this.renderTableHeaders()}</table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  history: state.history.history,
});

export default connect(mapStateToProps, { getHistory })(History);
