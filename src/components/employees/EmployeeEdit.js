import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faWindowClose,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

let EmployeeEdit = ({
  employee,
  confirmEdit,
  cancelEdit,
  openModal,
  index,
}) => {
  const [firstName, setFirstName] = useState(employee.firstName);
  const [lastName, setLastName] = useState(employee.lastName);
  const [hourlyRate, setHourlyRate] = useState(employee.hourlyRate);
  const [kitchenDayRate, setKitchenRate] = useState(employee.kitchenDayRate);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleHourlyRateChange = (e) => {
    setHourlyRate(e.target.value);
  };

  const handleKitchenRateChange = (e) => {
    setKitchenRate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedEmployee = {
      id: employee.id,
      firstName: firstName,
      lastName: lastName,
      hourlyRate: hourlyRate,
      kitchenDayRate: kitchenDayRate,
    };

    if (employee.isNew) {
      confirmEdit(updatedEmployee, index, true);
    } else {
      confirmEdit(updatedEmployee, index, false);
    }
  };

  return (
    <form className="employees__card" key={employee.id} onSubmit={handleSubmit}>
      <div className="employee__name">
        <input
          className="employee__input"
          value={firstName}
          placeholder="First Name"
          onChange={handleFirstNameChange}
        />
        <input
          className="employee__input"
          value={lastName}
          placeholder="Last Name"
          onChange={handleLastNameChange}
        />
      </div>
      <div className="employee__rate employee__rate--hourly">
        <h2>Hourly Rate</h2>
        <input
          className="employee__input"
          value={hourlyRate}
          placeholder="Hourly Rate"
          onChange={handleHourlyRateChange}
        />
      </div>
      <div className="employee__rate employee__rate--kitchen">
        <h2>Kitchen Rate</h2>
        <input
          className="employee__input"
          value={kitchenDayRate}
          placeholder="Kitchen Rate"
          onChange={handleKitchenRateChange}
        />
      </div>
      <div className="employee__btns">
        <button
          className="employee__btn employee__btn--edit"
          onClick={() => cancelEdit(index)}
          type="button"
        >
          <FontAwesomeIcon icon={faWindowClose} />
        </button>
        <button className="employee__btn employee__btn--history" type="submit">
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button
          onClick={() => openModal(employee.id)}
          className="employee__btn employee__btn--delete"
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </form>
  );
};

export default EmployeeEdit;
