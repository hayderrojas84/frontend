import '../../styles/FormField.css'

function FormField({ children, label = null, errors = [], spanClass = '' }) {
  return (
    <div className="form-field_container">
      <div className='field-children'>
        {label && (
          <span className={`field-label ${spanClass}`}>{label}:</span>
        )}
      {children}
      </div>
      {errors.length ? (
        <div className="errors">
          <small className="danger-text">
            {errors.map((error) => {
              return error
            }).join(', ')}
          </small>
        </div>

      ) : ('')}
    </div>
  )
}

export default FormField;