import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getHistory } from '../../redux/actions/historyActions';
import HistoryRows from './HistoryRows';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
  }

  componentDidMount() {
    this.props.getHistory(this.props.match.params.id).then(() => {
      this.setState({
        history: this.props.history,
      });
    });
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
    let history = this.state.history;
    if (history) {
      return (
        <tbody>
          {history.map((period, index) => (
            <HistoryRows key={index} period={period} />
          ))}
        </tbody>
      );
    }
  }

  render() {
    return (
      <div className="history">
        <header className="history__header">
          <h2>
            {this.state.history.length !== 0 &&
              this.state.history[0].firstName +
                ' ' +
                this.state.history[0].lastName}
          </h2>
        </header>
        <table className="history__table" cellSpacing={0}>
          {this.renderTableHeaders()}
          {this.renderTableRows()}
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  history: Object.values(state.history.history),
});

export default connect(mapStateToProps, { getHistory })(History);
