import React, { useState } from 'react';

const Calculator = () => {
  const renderHeaders = () => {};

  const renderRows = () => {};

  return (
    <div className="calculator">
      <div className="calculator__column">
        <h2 className="calculator__header">Hours</h2>
        <input
          className="period__tinput"
          type="number"
          value={0}
          // name={KITCHEN_DAYS}
          // onChange={handleOnChange}
        />
      </div>
      <div className="calculator__column">
        <h2 className="calculator__header">Pay Rate</h2>
        <input
          className="period__tinput"
          type="number"
          value={0}
          // name={KITCHEN_DAYS}
          // onChange={handleOnChange}
        />
      </div>
      <div className="calculator__column">
        <h2 className="calculator__header">Total Pay Needed</h2>
        <input
          className="period__tinput"
          type="number"
          value={0}
          // name={KITCHEN_DAYS}
          // onChange={handleOnChange}
        />
      </div>
      <div className="calculator__column">
        <h2 className="calculator__header">Percent Needed</h2>
        <input
          className="period__tinput"
          type="number"
          value={0}
          // name={KITCHEN_DAYS}
          // onChange={handleOnChange}
        />
      </div>
    </div>
  );
};

export default Calculator;
