import '../../styles/Form.css'

function FormComponent({ handleSubmit, children, enctype = null, className = '', operation = 'Agregar', model = '' }) {  
  return (
    <div className="form-container">
      <h2>{`${operation} ${model}`}</h2>
      {enctype ? (
        <form className='form' onSubmit={handleSubmit} encType={enctype}>
          <div className={`form-content  ${className}`}>
            {children}
          </div>
          <div className="submit-button-container">
            <button className="submit_button success">{operation}</button>
          </div>
        </form>
      ) : (
        <form className='form' onSubmit={handleSubmit}>
          <div className={`form-content  ${className}`}>
            {children}
          </div>
          <div className="submit-button-container">
            <button className="submit_button success">{operation}</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default FormComponent;