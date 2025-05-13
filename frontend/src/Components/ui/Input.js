import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder,
  required = false,
  min,
  max,
  step
}) => {
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''}`}
        required={required}
        min={min}
        max={max}
        step={step}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input; 