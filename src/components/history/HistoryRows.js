import React from 'react';
import { formatDate } from '../period/helpers';

const HistoryRows = ({ period }) => {
  return (
    <tr className="history__trow">
      <td>
        {formatDate(period.periodStart)
          ? formatDate(period.periodStart)
          : 'N/A'}
      </td>
      <td>
        {formatDate(period.periodEnd) ? formatDate(period.periodEnd) : 'N/A'}
      </td>
      <td>{period.hourlyRate ? '$' + period.hourlyRate : 0}</td>
      <td>{period.kitchenDayRate ? '$' + period.kitchenDayRate : 0}</td>
      <td>{period.kitchenDays ? period.kitchenDays : 0}</td>
      <td>
        {period.calculatedKitchenHours
          ? period.calculatedKitchenHours
          : '00:00'}
      </td>
      <td>{period.serverHours ? period.serverHours : '00:00'}</td>
      <td>{period.sickHours ? period.sickHours : '00:00'}</td>
      <td>{period.totalHours ? period.totalHours : '00:00'}</td>
      <td>{period.totalHoursRounded ? period.totalHoursRounded : '00:00'}</td>
      <td>{period.tips ? period.tips : 0}</td>
    </tr>
  );
};

export default HistoryRows;
