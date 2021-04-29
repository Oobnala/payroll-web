import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHistory } from '@fortawesome/free-solid-svg-icons';

const EmployeeCard = ({ employee, edit, index }) => {
  return (
    <div className="employees__card" key={employee.id}>
      <div className="employee__name">
        <h1>{employee.firstName}</h1>
        <h1>{employee.lastName}</h1>
      </div>
      <div className="employee__rate employee__rate--hourly">
        <h2>Hourly Rate</h2>
        <p>{'$' + employee.hourlyRate}</p>
      </div>
      <div className="employee__rate employee__rate--kitchen">
        <h2>Kitchen Rate</h2>
        <p>{'$' + employee.kitchenDayRate}</p>
      </div>
      <button
        className="employee__btn employee__btn--edit"
        onClick={() => edit(index)}
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button className="employee__btn employee__btn--history">
        <FontAwesomeIcon icon={faHistory} />
      </button>
    </div>
  );
};

export default EmployeeCard;
