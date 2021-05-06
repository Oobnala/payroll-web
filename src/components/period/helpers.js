const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatDate = (date) => {
  let selectedDate = new Date(date);
  // Since date was one day off when converted to date object, must offset to local time
  selectedDate = new Date(
    selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
  );
  let month = selectedDate.getMonth() + 1;
  let day = selectedDate.getDate();
  let year = selectedDate.getFullYear();
  return MONTHS[month - 1] + ` ${day},` + ` ${year}`;
};
