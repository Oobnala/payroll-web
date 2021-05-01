import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import server from '../../api/server';

const PeriodRows = ({ employee, index, handleUpdateEmployee }) => {
  const [kitchenDays, setKitchenDays] = useState(employee.kitchenDays);
  const [kitchenHours, setKitchenHours] = useState(
    employee.calculatedKitchenHours
  );
  const [serverHours, setServerHours] = useState(employee.serverHours);
  const [sickHours, setSickHours] = useState(employee.sickHours);
  const [totalHours, setTotal] = useState(employee.totalHours);
  const [totalHoursRounded, setTotalHoursRounded] = useState(
    employee.totalHoursRounded
  );
  const [tips, setTips] = useState(employee.tips);

  useEffect(() => {
    let updatedEmployee = {
      ...employee,
      kitchenDays: kitchenDays,
      calculatedKitchenHours: kitchenHours,
      serverHours: serverHours,
      sickHours: sickHours,
      totalHours: totalHours,
      totalHoursRounded: totalHoursRounded,
      tips: tips,
    };

    handleUpdateEmployee(updatedEmployee, index);
  }, [
    kitchenDays,
    kitchenHours,
    serverHours,
    sickHours,
    totalHours,
    totalHoursRounded,
    tips,
  ]);

  // Dynammic Calculations happen here
  const handleOnChange = (e) => {
    let value = e.target.value;

    switch (e.target.name) {
      case 'kitchenDays': {
        setKitchenDays(value);
        let kitchenDayRate = employee.kitchenDayRate;
        let hourlyRate = employee.hourlyRate;
        // Kitchen Hour Calculations
        break;
      }
      case 'serverHours':
        setServerHours(value);
        break;
      case 'sickHours':
        setSickHours(value);
        break;
      case 'tips':
        setTips(value);
        break;
    }
  };

  return (
    <tr key={index} className="period__trow">
      <td>{employee.firstName}</td>
      <td>{employee.lastName}</td>
      <td>{employee.hourlyRate}</td>
      <td>{employee.kitchenDayRate}</td>
      <td>
        <input
          className="period__tinput"
          type="number"
          value={kitchenDays}
          name="kitchenDays"
          onChange={handleOnChange}
        />
      </td>
      <td>{kitchenHours}</td>
      <td>
        <input
          className="period__tinput"
          type="text"
          value={serverHours}
          name="serverHours"
          onChange={handleOnChange}
        />
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          value={sickHours}
          name="sickHours"
          onChange={handleOnChange}
        />
      </td>
      <td>{totalHours}</td>
      <td>{totalHoursRounded}</td>
      <td>
        <input
          className="period__tinput"
          type="number"
          defaultValue={tips}
          name="tips"
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
