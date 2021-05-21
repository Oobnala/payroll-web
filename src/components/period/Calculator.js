import React, { useState } from 'react';
import {
  TOTAL_HOURS,
  HOURLY_RATE,
  TOTAL_PAY_NEEDED,
  CASH_PERCENTAGE,
} from './properties';

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
        break;
      }
      case HOURLY_RATE: {
        setHourlyRate(value);
        break;
      }
      case TOTAL_PAY_NEEDED: {
        setTotalPayNeeded(value);
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
        <h2 className="calculator__header">Total Hours</h2>
        <input
          className="period__tinput"
          type="text"
          value={totalHours}
          name={TOTAL_HOURS}
          onChange={handleOnChange}
        />
      </div>
      <div className="calculator__column">
        <h2 className="calculator__header">Hourly Rate</h2>
        <div className="calculator__input">
          <p>$</p>
          <input
            className="period__tinput"
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
            className="period__tinput"
            type="number"
            value={totalPayNeeded}
            name={TOTAL_PAY_NEEDED}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <div className="calculator__column">
        <h2 className="calculator__header">Percent Needed</h2>
        <input
          className="period__tinput"
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
