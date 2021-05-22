import { CASH_PERCENTAGE, TOTAL_PAY_NEEDED } from "./properties";

export const padTime = (time) => {
  if (parseInt(time) < 10) {
    time = '0' + time.toString();
    return time;
  }
  return time.toString();
};

export const addTimes = (time1, time2) => {
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

export const roundToNearestQuarter = (time) => {
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

export const cleanValue = (value) => {
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

export const calculateKitchenHours = (
  checkPayout,
  hourlyRate
) => {
  let hoursWorkedDecimal = (checkPayout / hourlyRate).toFixed(2);
  let hoursWorkedSplitArr = hoursWorkedDecimal.toString().split('.');

  let hours = 0;
  let mins = 0;
  if (hoursWorkedSplitArr.length > 0) {
    hours = hoursWorkedSplitArr[0];
    mins = Math.round(hoursWorkedSplitArr[1] * 0.6);
  }

  return `${hours}:${padTime(mins)}`;

};

export const calculateTotalPayNeeded = (kitchenDayRate, kitchenDays) => {
  return (kitchenDays * kitchenDayRate).toFixed(2)
}

export const calculateCashPayout = (cashPercentage, totalPayNeeded) => {
  if (typeof cashPercentage === 'undefined') {
    cashPercentage = 0
  }

  return (totalPayNeeded * (cashPercentage * 0.01)).toFixed(2)
}

export const calculateCheckPayout = (cashPercentage, totalPayNeeded) => { 
  if (typeof cashPercentage === 'undefined') {
    cashPercentage = 0
  }

  return (totalPayNeeded *  ((100 - cashPercentage) *  0.01)).toFixed(2)
}