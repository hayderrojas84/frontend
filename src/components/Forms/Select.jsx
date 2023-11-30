function SelectComponent ({multiple=false, onChange, defaultValue = '', options = [], name='', disabled = false, required = false, model = ''}){
  return (
    <select name={model} multiple={multiple} disabled={disabled} onChange={onChange} defaultValue={defaultValue} required={required}>
      <option value="">Seleccione {name}</option>
      {options.map((option) => {
        return <option key={option.id} value={option.id}>{option.name}</option>
      })}
    </select>
  )
}

export default SelectComponent;