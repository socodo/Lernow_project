const FormInput = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  value,
  onChange,
  className = '',
  ...rest // allow additional props like readOnly, onKeyDown
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${className} placeholder:text-xs px-2 py-1.5`}
        {...rest}
      />
    </div>
  )
}

export default FormInput