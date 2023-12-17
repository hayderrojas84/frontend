export default function AlertNewRegister({ model = '', handleSubmit, toggleModal, event }) {
  return (
    <div className="alert_register">
      <p>Estas seguro que deseas agregar el nuevo registro de {model}?</p>
      <div className="submit-button-container">
        <button className="submit_button success" onClick={() => {
          handleSubmit(event);
          toggleModal();
        }}>Confirmar</button>
      </div>

    </div>
  )
}