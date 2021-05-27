import React, { useState, useEffect } from 'react';

const SubmitModal = ({
  pdf,
  handleCloseModal,
  startDateUnformatted,
  startDate,
  endDate,
  emailPDF,
}) => {
  const [loading, setLoading] = useState(true);
  const [pdfURL, setPdfURL] = useState('');

  const sendEmail = () => {
    emailPDF(startDateUnformatted);
    handleCloseModal();
  };

  useEffect(() => {
    if (pdfURL !== '') {
      setLoading(false);
    }
    setPdfURL(pdf);
  }, [pdfURL]);
  return (
    <div className="modal">
      <div className="modal__container">
        <header className="modal__header">
          <h1>
            {startDate} - {endDate}
          </h1>
        </header>

        <div className="modal__contents">
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <iframe className="modal__pdf" src={pdfURL} />
          )}
        </div>

        <div>
          <button className="modal__btn" onClick={handleCloseModal}>
            Cancel
          </button>
          <button className="modal__btn" onClick={() => sendEmail()}>
            Email
          </button>
          <a href={pdf} download={`${startDateUnformatted}-TimeSheet.pdf`}>
            <button className="modal__btn" onClick={handleCloseModal}>
              Download
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
