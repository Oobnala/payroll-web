import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faWindowClose,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

const EmployeeEdit = ({
  employee,
  confirmEdit,
  cancelEdit,
  openModal,
  index,
}) => {
  return (
    <div className="employees__card" key={employee.id}>
      <div className="employee__name">
        <input
          className="employee__name-input"
          defaultValue={employee.firstName}
          placeholder="First Name"
        />
        <input
          className="employee__name-input"
          defaultValue={employee.lastName}
          placeholder="Last Name"
        />
      </div>
      <div className="employee__rate employee__rate--hourly">
        <h2>Hourly Rate</h2>
        <input
          className="employee__rate-input"
          defaultValue={employee.hourlyRate}
        />
      </div>
      <div className="employee__rate employee__rate--kitchen">
        <h2>Kitchen Rate</h2>
        <input
          className="employee__rate-input"
          defaultValue={employee.kitchenDayRate}
        />
      </div>
      <div className="employee__btns">
        <button
          className="employee__btn employee__btn--edit"
          onClick={() => cancelEdit(index)}
        >
          <FontAwesomeIcon icon={faWindowClose} />
        </button>
        <button
          className="employee__btn employee__btn--history"
          onClick={() => confirmEdit(index)}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button
          onClick={() => openModal(index)}
          className="employee__btn employee__btn--delete"
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </div>
  );
};

export default EmployeeEdit;
