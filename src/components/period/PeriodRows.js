import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

const PeriodRows = ({ employee, index }) => {
  return (
    <tr key={index} className="period__trow">
      <td>{employee.firstName}</td>
      <td>{employee.lastName}</td>
      <td>
        <input
          className="period__tinput"
          type="text"
          defaultValue={employee.hourlyRate}
        />
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          defaultValue={employee.kitchenDayRate}
        />
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          defaultValue={employee.kitchenDays}
        />
      </td>
      <td>{employee.calculatedKitchenHours}</td>
      <td>
        <input
          className="period__tinput"
          type="text"
          defaultValue={employee.serverHours}
        />
      </td>
      <td>
        <input
          className="period__tinput"
          type="text"
          defaultValue={employee.sickHours}
        />
      </td>
      <td>{employee.totalHours}</td>
      <td>{employee.totalHoursRounded}</td>
      <td>
        <input
          className="period__tinput"
          type="text"
          defaultValue={employee.tips}
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
