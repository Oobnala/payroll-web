import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

const padTime = (time) => {
  if (parseInt(time) < 10) {
    time = '0' + time.toString();
    return time;
  }
  return time.toString();
};

const addTimes = (time1, time2) => {
  let time1Split = time1.split(':');
  let time2Split = time2.split(':');

  let addedHours = 0;
  let addedMins = 0;
  if (time1Split.length > 0 && time2Split.length > 0) {
    addedHours = parseInt(time1Split[0]) + parseInt(time2Split[0]);
    addedMins = parseInt(time1Split[1]) + parseInt(time2Split[1]);

    if (addedMins > 60) {
      let remainderMins = addedMins % 60;
      let carryHours = Math.floor(addedMins / 60);
      addedHours += carryHours;
      addedMins = remainderMins;
    }
  }

  return `${addedHours}:${padTime(addedMins)}`;
};

const roundToNearestQuarter = (time) => {
  let timeSplit = time.split(':');

  let hours = 0;
  let mins = 0;
  if (timeSplit.length > 0) {
    hours = parseInt(timeSplit[0]);
    mins = parseInt(timeSplit[1]);

    let remainderAsDecimal = (mins % 15) / 15;
    let numOfQuarters = 0;

    // Use remainder as decimal to decide if we should
    // use ceil or floor on this division
    if (remainderAsDecimal >= 0.5) {
      numOfQuarters = Math.ceil(mins / 15);
    } else {
      numOfQuarters = Math.floor(mins / 15);
    }

    if (numOfQuarters == 4) {
      mins = 0;
      hours += 1;
    } else {
      mins = 15 * numOfQuarters;
    }
  }

  return `${hours}:${padTime(mins)}`;
};

const cleanValue = (value) => {
  if (
    value === '' ||
    value === null ||
    typeof value === 'undefined' ||
    !value.includes(':') ||
    value.split(':')[1] === ''
  ) {
    return '0:00';
  }
  return value;
};

const calculateKitchenHours = (kitchenDayRate, hourlyRate, kitchenDays) => {
  let hoursWorkedDecimal = (
    (kitchenDays * kitchenDayRate) /
    hourlyRate
  ).toFixed(2);
  let hoursWorkedSplitArr = hoursWorkedDecimal.toString().split('.');

  let hours = 0;
  let mins = 0;
  if (hoursWorkedSplitArr.length > 0) {
    hours = hoursWorkedSplitArr[0];
    mins = Math.round(hoursWorkedSplitArr[1] * 0.6);
  }

  return `${hours}:${padTime(mins)}`;
};

const PeriodRows = ({ employee, index, handleUpdateEmployee }) => {
  const [kitchenDays, setKitchenDays] = useState('');
  const [kitchenHours, setKitchenHours] = useState('');
  const [serverHours, setServerHours] = useState('');
  const [sickHours, setSickHours] = useState('');
  const [totalHours, setTotal] = useState('');
  const [totalHoursRounded, setTotalHoursRounded] = useState('');
  const [tips, setTips] = useState(0);

  useEffect(() => {
    setKitchenDays(employee.kitchenDays);
    setKitchenHours(employee.calculatedKitchenHours);
    setServerHours(employee.serverHours);
    setSickHours(employee.sickHours);
    setTotal(employee.totalHours);
    setTotalHoursRounded(employee.totalHoursRounded);
    setTips(employee.tips);

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

    // handleUpdateEmployee(updatedEmployee, index);
  }, [
    kitchenDays,
    kitchenHours,
    serverHours,
    sickHours,
    totalHours,
    totalHoursRounded,
    tips,
    employee,
  ]);

  // Dynammic Calculations happen here
  const handleOnChange = (e) => {
    let value = e.target.value;

    switch (e.target.name) {
      case 'kitchenDays': {
        setKitchenDays(value);

        let kitchenDayRate = employee.kitchenDayRate;
        let hourlyRate = employee.hourlyRate;

        // Set new kitchen hours
        let kitchenHours = calculateKitchenHours(
          kitchenDayRate,
          hourlyRate,
          value
        );
        setKitchenHours(kitchenHours);

        // Set new Total
        let serverHours = cleanValue(employee.serverHours);
        let summedTimes = addTimes(serverHours, kitchenHours);

        setTotal(summedTimes);
        setTotalHoursRounded(roundToNearestQuarter(summedTimes));
        break;
      }
      case 'serverHours':
        setServerHours(value);
        value = cleanValue(value);

        // Set total
        let kitchenHours = cleanValue(employee.calculatedKitchenHours);
        let summedTimes = addTimes(value, kitchenHours);

        setTotal(summedTimes);
        setTotalHoursRounded(roundToNearestQuarter(summedTimes));
        break;
      case 'sickHours':
        setSickHours(value);
        break;
      case 'tips':
        let tip = parseFloat(value);
        setTips(tip.toFixed(2));
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
          value={kitchenDays !== null ? kitchenDays : ''}
          name="kitchenDays"
          onChange={handleOnChange}
        />
      </td>
      <td>{kitchenHours}</td>
      <td>
        <input
          className="period__tinput"
          type="text"
          value={serverHours !== null ? serverHours : ''}
          name="serverHours"
          onChange={handleOnChange}
        />
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          value={sickHours !== null ? sickHours : ''}
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
          value={tips !== null ? tips : ''}
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
