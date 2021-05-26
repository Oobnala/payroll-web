import React, { useState } from 'react';
import {
  TOTAL_HOURS,
  HOURLY_RATE,
  TOTAL_PAY_NEEDED,
  CASH_PERCENTAGE,
} from './properties';

const calculatePayForXHours = (totalHours, hourlyRate) => {
  let totalHoursSplit = totalHours.split(':');

  if (totalHoursSplit.length === 0) return 0;

  const totalHoursNumOfHours = totalHoursSplit[0];
  const totalHoursNumOfMins = totalHoursSplit[1];

  const dollarAmountHours = totalHoursNumOfHours * hourlyRate;
  const dollarAmountMinutes = (totalHoursNumOfMins / 60) * hourlyRate;
  const totalDollarAmount = dollarAmountHours + dollarAmountMinutes;

  return totalDollarAmount;
};

const calculatePercentNeeded = (payForXHours, totalPayNeeded) => {
  return (100 - (payForXHours / totalPayNeeded) * 100).toFixed(4);
};

const Calculator = () => {
  const [totalHours, setTotalHours] = useState('00:00');
  const [hourlyRate, setHourlyRate] = useState('0');
  const [totalPayNeeded, setTotalPayNeeded] = useState('0');
  const [cashPercentage, setCashPercentage] = useState('0');

  // Add calculations here
  const handleOnChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    switch (name) {
      case TOTAL_HOURS: {
        setTotalHours(value);
        setCashPercentage(
          calculatePercentNeeded(
            calculatePayForXHours(value, hourlyRate),
            totalPayNeeded
          )
        );
        break;
      }
      case HOURLY_RATE: {
        setHourlyRate(value);
        setCashPercentage(
          calculatePercentNeeded(
            calculatePayForXHours(totalHours, value),
            totalPayNeeded
          )
        );
        break;
      }
      case TOTAL_PAY_NEEDED: {
        setTotalPayNeeded(value);
        setCashPercentage(
          calculatePercentNeeded(
            calculatePayForXHours(totalHours, hourlyRate),
            value
          )
        );
        break;
      }
      case CASH_PERCENTAGE: {
        setCashPercentage(value);
        break;
      }
    }
  };

  const clear = () => {
    setTotalHours('00:00');
    setHourlyRate('0');
    setTotalPayNeeded('0');
    setCashPercentage('0');
  };

  return (
    <div className="calculator">
      <div className="calculator__column">
        <h2 className="calculator__header">Hourly Rate</h2>
        <div className="calculator__input">
          <p>$</p>
          <input
            className="calculator__cinput"
            type="number"
            value={hourlyRate}
            name={HOURLY_RATE}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div className="calculator__column">
        <h2 className="calculator__header">Total Pay Needed</h2>
        <div className="calculator__input">
          <p>$</p>
          <input
            className="calculator__cinput"
            type="number"
            value={totalPayNeeded}
            name={TOTAL_PAY_NEEDED}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div className="calculator__column">
        <h2 className="calculator__header">Hours Wanted</h2>
        <input
          className="calculator__cinput"
          type="text"
          value={totalHours}
          name={TOTAL_HOURS}
          onChange={handleOnChange}
        />
      </div>
      <div className="calculator__column">
        <h2 className="calculator__header">Percent Needed</h2>
        <input
          className="calculator__cinput"
          type="number"
          value={cashPercentage}
          name={CASH_PERCENTAGE}
          onChange={handleOnChange}
        />
      </div>
      <div className="calculator__column">
        <button className="calculator__clear" onClick={() => clear()}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default Calculator;
