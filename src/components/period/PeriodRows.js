import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import {
  KITCHEN_DAYS,
  CALCULATED_KITCHEN_HOURS,
  SERVER_HOURS,
  SICK_HOURS,
  TOTAL_HOURS,
  TOTAL_HOURS_ROUNDED,
  TIPS,
  CASH_PERCENTAGE,
  MISC,
  TOTAL_PAY_NEEDED,
  CASH_PAYOUT,
  CHECK_PAYOUT,
} from './properties';
import {
  calculateKitchenHours,
  calculateTotalPayNeeded,
  calculateCashPayout,
  calculateCheckPayout,
  cleanValue,
  addTimes,
  roundToNearestQuarter,
} from './calculations';

const PeriodRows = ({ employee, index, handleUpdateEmployee, isCurrent }) => {
  // Makes copy of employee object and sets to local state via hooks.
  // Can alter currentEmployee data then pass to CurrentPeriod.js
  // to update actual employees state when handleOnChange is done

  const [currentEmployee, setEmployee] = useState({ ...employee });

  useEffect(() => {
    setEmployee(employee);
  }, [employee]);

  const handleOnChange = (e) => {
    let value = e.target.value;

    switch (e.target.name) {
      case KITCHEN_DAYS: {
        setEmployeeValue(KITCHEN_DAYS, value);

        let kitchenDayRate = employee.kitchenDayRate;

        let totalPayNeeded = calculateTotalPayNeeded(kitchenDayRate, value);
        setEmployeeValue(TOTAL_PAY_NEEDED, totalPayNeeded);

        let cashPercentage = employee.cashPercentage;

        //  Set Cash Payout
        let cashPayout = calculateCashPayout(cashPercentage, totalPayNeeded);
        setEmployeeValue(CASH_PAYOUT, cashPayout);

        // Set Check Payout
        let checkPayout = calculateCheckPayout(cashPercentage, totalPayNeeded);
        setEmployeeValue(CHECK_PAYOUT, checkPayout);

        let hourlyRate = employee.hourlyRate;
        // Set new kitchen hours
        let kitchenHours = calculateKitchenHours(checkPayout, hourlyRate);
        setEmployeeValue(CALCULATED_KITCHEN_HOURS, kitchenHours);

        let serverHours = cleanValue(employee.serverHours);
        let miscHours = cleanValue(employee.misc);
        // Set total hours
        let summedTimes = addTimes(
          addTimes(serverHours, kitchenHours),
          miscHours
        );

        setEmployeeValue(TOTAL_HOURS, summedTimes);
        setEmployeeValue(TOTAL_HOURS_ROUNDED, summedTimes);
        break;
      }

      case CASH_PERCENTAGE: {
        setEmployeeValue(CASH_PERCENTAGE, value);

        let totalPayNeeded = employee.totalPayNeeded;

        // Set Cash Payout
        let cashPayout = calculateCashPayout(value, totalPayNeeded);
        setEmployeeValue(CASH_PAYOUT, cashPayout);

        // Set Check Payout
        let checkPayout = calculateCheckPayout(value, totalPayNeeded);
        setEmployeeValue(CHECK_PAYOUT, checkPayout);

        let hourlyRate = employee.hourlyRate;

        // Set new kitchen hours
        let kitchenHours = calculateKitchenHours(checkPayout, hourlyRate);
        setEmployeeValue(CALCULATED_KITCHEN_HOURS, kitchenHours);

        let serverHours = cleanValue(employee.serverHours);
        let miscHours = cleanValue(employee.misc);
        // Set total hours
        let summedTimes = addTimes(
          addTimes(serverHours, kitchenHours),
          miscHours
        );

        setEmployeeValue(TOTAL_HOURS, summedTimes);
        setEmployeeValue(TOTAL_HOURS_ROUNDED, summedTimes);
        break;
      }

      case MISC: {
        setEmployeeValue(MISC, value);

        let kitchenHours = cleanValue(employee.calculatedKitchenHours);
        let serverHours = cleanValue(employee.serverHours);
        let miscHours = cleanValue(value);

        // Set total hours
        let summedTimes = addTimes(
          addTimes(serverHours, kitchenHours),
          miscHours
        );
        setEmployeeValue(TOTAL_HOURS, summedTimes);
        setEmployeeValue(TOTAL_HOURS_ROUNDED, summedTimes);
        break;
      }

      case SERVER_HOURS: {
        setEmployeeValue(SERVER_HOURS, value);

        let serverHours = cleanValue(value);
        let kitchenHours = cleanValue(employee.calculatedKitchenHours);
        let miscHours = cleanValue(employee.misc);

        // Set total hours
        let summedTimes = addTimes(
          addTimes(serverHours, kitchenHours),
          miscHours
        );
        setEmployeeValue(TOTAL_HOURS, summedTimes);
        setEmployeeValue(TOTAL_HOURS_ROUNDED, summedTimes);
        break;
      }

      case SICK_HOURS: {
        setEmployeeValue(SICK_HOURS, value);
        break;
      }

      case TIPS: {
        setEmployeeValue(TIPS, value);
        break;
      }
    }

    handleUpdateEmployee(currentEmployee, index);
  };

  const setEmployeeValue = (property, value) => {
    if (property === TOTAL_HOURS_ROUNDED) {
      setEmployee((currentValues) => {
        currentValues[property] = roundToNearestQuarter(value);
        return currentValues;
      });
    } else {
      setEmployee((currentValues) => {
        currentValues[property] = value;
        return currentValues;
      });
    }
  };

  return (
    <tr key={index} className="period__trow">
      <td>{currentEmployee.firstName}</td>
      <td>{currentEmployee.lastName}</td>
      <td>{'$' + currentEmployee.hourlyRate}</td>
      <td>{'$' + currentEmployee.kitchenDayRate}</td>
      <td>
        <input
          className="period__tinput"
          type="number"
          step="0.01"
          pattern="\d*"
          value={
            currentEmployee.kitchenDays !== null
              ? currentEmployee.kitchenDays
              : 0
          }
          name={KITCHEN_DAYS}
          onChange={handleOnChange}
          disabled={!isCurrent}
        />
      </td>
      <td>
        <div className="period__tinput--cash">
          <p>$</p>
          {currentEmployee.totalPayNeeded !== null &&
          currentEmployee.totalPayNeeded !== 0
            ? currentEmployee.totalPayNeeded
            : (0).toFixed(2)}
        </div>
      </td>
      <td>
        <input
          className="period__tinput"
          type="number"
          step="0.01"
          pattern="\d*"
          value={
            currentEmployee.cashPercentage !== null
              ? currentEmployee.cashPercentage
              : '0'
          }
          name={CASH_PERCENTAGE}
          onChange={handleOnChange}
          disabled={!isCurrent}
        />
      </td>
      <td>
        <div className="period__tinput--cash">
          <p>$</p>
          {currentEmployee.cashPayout !== null &&
          currentEmployee.cashPayout !== 0
            ? currentEmployee.cashPayout
            : (0).toFixed(2)}
        </div>
      </td>
      <td>
        <div className="period__tinput--cash">
          <p>$</p>
          {currentEmployee.checkPayout !== null &&
          currentEmployee.checkPayout !== 0
            ? currentEmployee.checkPayout
            : (0).toFixed(2)}
        </div>
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
          inputmode="numeric"
          value={currentEmployee.misc !== null ? currentEmployee.misc : '00:00'}
          name={MISC}
          onChange={handleOnChange}
          disabled={!isCurrent}
        />
      </td>
      <td>
        {currentEmployee.calculatedKitchenHours !== null
          ? currentEmployee.calculatedKitchenHours
          : '00:00'}
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
          value={
            currentEmployee.serverHours !== null
              ? currentEmployee.serverHours
              : '00:00'
          }
          name={SERVER_HOURS}
          onChange={handleOnChange}
          disabled={!isCurrent}
        />
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
          value={
            currentEmployee.sickHours !== null
              ? currentEmployee.sickHours
              : '00:00'
          }
          name={SICK_HOURS}
          onChange={handleOnChange}
          disabled={!isCurrent}
        />
      </td>
      <td>
        {currentEmployee.totalHours !== null
          ? currentEmployee.totalHours
          : '00:00'}
      </td>
      <td>
        {currentEmployee.totalHoursRounded !== null
          ? currentEmployee.totalHoursRounded
          : '00:00'}
      </td>
      <td>
        <input
          className="period__tinput"
          type="number"
          step="0.01"
          pattern="\d*"
          value={currentEmployee.tips !== null ? currentEmployee.tips : 0}
          name={TIPS}
          onChange={handleOnChange}
          disabled={!isCurrent}
        />
      </td>
      <td>
        {/*
             On click here this button will keep state of if it is locked or not 
        */}
        <button className="period__history">
          <FontAwesomeIcon icon={faLockOpen} />
        </button>
      </td>
      <td>
        <Link
          to={{
            pathname: `/employee/${employee.id}`,
          }}
        >
          <button className="period__history">
            <FontAwesomeIcon icon={faHistory} />
          </button>
        </Link>
      </td>
    </tr>
  );
};

export default PeriodRows;
