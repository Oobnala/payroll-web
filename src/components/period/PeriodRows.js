import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import {
  calculateKitchenHours,
  cleanValue,
  addTimes,
  roundToNearestQuarter,
} from './calculations';

const KITCHEN_DAYS = 'kitchenDays';
const CALCULATED_KITCHEN_HOURS = 'calculatedKitchenHours';
const SERVER_HOURS = 'serverHours';
const SICK_HOURS = 'sickHours';
const TOTAL_HOURS = 'totalHours';
const TOTAL_HOURS_ROUNDED = 'totalHoursRounded';
const TIPS = 'tips';

const PeriodRows = ({ employee, index, handleUpdateEmployee }) => {
  // Makes copy of employee object and sets to local state via hooks.
  // Can alter currentEmployee data then pass to CurrentPeriod.js
  // to update actual employees state when handleOnChange is done

  const [currentEmployee, setEmployee] = useState({ ...employee });

  useEffect(() => {
    setEmployee(employee);
  }, [employee]);

  // Dynammic Calculations happen here
  const handleOnChange = (e) => {
    let value = e.target.value;

    switch (e.target.name) {
      case KITCHEN_DAYS: {
        setEmployeeValue(KITCHEN_DAYS, value);

        let kitchenDayRate = employee.kitchenDayRate;
        let hourlyRate = employee.hourlyRate;

        // Set new kitchen hours
        let kitchenHours = calculateKitchenHours(
          kitchenDayRate,
          hourlyRate,
          value
        );

        setEmployeeValue(CALCULATED_KITCHEN_HOURS, kitchenHours);

        // Set new Total
        let serverHours = cleanValue(employee.serverHours);
        let summedTimes = addTimes(serverHours, kitchenHours);

        setEmployeeValue(TOTAL_HOURS, summedTimes);
        setEmployeeValue(TOTAL_HOURS_ROUNDED, summedTimes);
        break;
      }
      case SERVER_HOURS: {
        setEmployeeValue(SERVER_HOURS, value);

        value = cleanValue(value);

        // Set total
        let kitchenHours = cleanValue(employee.calculatedKitchenHours);
        let summedTimes = addTimes(value, kitchenHours);

        setEmployeeValue(TOTAL_HOURS, summedTimes);
        setEmployeeValue(TOTAL_HOURS_ROUNDED, summedTimes);
        break;
      }
      case SICK_HOURS:
        setEmployeeValue(SICK_HOURS, value);
        break;
      case TIPS:
        let tip = parseFloat(value).toFixed(2);
        if (isNaN(tip)) {
          tip = 0;
        }
        setEmployeeValue(TIPS, tip);
        break;
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
      <td>{currentEmployee.hourlyRate}</td>
      <td>{currentEmployee.kitchenDayRate}</td>
      <td>
        <input
          className="period__tinput"
          type="number"
          value={
            currentEmployee.kitchenDays !== null
              ? currentEmployee.kitchenDays
              : 0
          }
          name={KITCHEN_DAYS}
          onChange={handleOnChange}
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
          value={
            currentEmployee.serverHours !== null
              ? currentEmployee.serverHours
              : '00:00'
          }
          name={SERVER_HOURS}
          onChange={handleOnChange}
        />
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          value={
            currentEmployee.sickHours !== null
              ? currentEmployee.sickHours
              : '00:00'
          }
          name={SICK_HOURS}
          onChange={handleOnChange}
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
          value={currentEmployee.tips !== null ? currentEmployee.tips : 0}
          name={TIPS}
          onChange={handleOnChange}
        />
      </td>
      <td>
        <button className="period__history">
          <FontAwesomeIcon icon={faHistory} />
        </button>
      </td>
    </tr>
  );
};

export default PeriodRows;
