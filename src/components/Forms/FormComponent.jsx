import { useState } from 'react';
import '../../styles/Form.css'
import Modal from '../Utils/Modal';
import AlertNewRegister from './AlertNewRegister';

function FormComponent({ handleSubmit, children, enctype = null, className = '', operation = 'Agregar', model = '', showAlert = false }) {  
  const [showModal, setShowModal] = useState(false);
  const [event, setEvent] = useState(null);

  const toggleModal = () => {
    setShowModal((oldShow) => !oldShow);
  }

  const handleSubmitWithAlert = (e) => {
    setEvent(e);
    e.preventDefault();
    if (showAlert && operation.toLowerCase() !== 'editar' && operation.toLowerCase() !== 'actualizar') {
      toggleModal();
    } else {
      handleSubmit(e);
    }
  }
  
  return (
    <div className="form-container">
      <h2>{`${operation} ${model}`}</h2>
      {enctype ? (
        <form className='form' onSubmit={handleSubmitWithAlert} encType={enctype}>
          <div className={`form-content  ${className}`}>
            {children}
          </div>
          <div className="submit-button-container">
            <button className="submit_button success">{operation}</button>
          </div>
        </form>
      ) : (
        <form className='form' onSubmit={handleSubmitWithAlert}>
          <div className={`form-content  ${className}`}>
            {children}
          </div>
          <div className="submit-button-container">
            <button className="submit_button success">{operation}</button>
          </div>
        </form>
      )}
      {showModal && (
        <Modal onClose={toggleModal}>
          <AlertNewRegister event={event} handleSubmit={handleSubmit} toggleModal={toggleModal} model={model} />
        </Modal>
      )}
    </div>
  )
}

export default FormComponent;