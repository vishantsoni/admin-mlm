import React, { FC, useRef } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  step?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string; // Optional hint text
  required?: boolean;
  accept?: string;
  inputMode?: string;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  value,
  onChange,
  className = "",
  min,
  max,
  maxLength,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  required = false,
  inputMode = "text"
}) => {
  // 1. Create a reference to the native input element
  const inputRef = useRef<HTMLInputElement>(null);

  // 2. Helper function to programmatically trigger the browser picker
  const handleOpenPicker = () => {
    if (type === "date" && inputRef.current && typeof inputRef.current.showPicker === "function") {
      try {
        inputRef.current.showPicker();
      } catch (err) {
        console.error("Browser does not support showPicker()", err);
      }
    }
  };

  // 3. Handle Keyboard Accessibility (Space or Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "date" && (e.key === " " || e.key === "Enter")) {
      e.preventDefault(); // Stop page scrolling on Space press
      handleOpenPicker();
    }
  };

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  // Extra utility class for date inputs to look clickable
  if (type === "date") {
    inputClasses += ` cursor-pointer`;
  }

  return (
    <div className="relative">
      <input
        ref={inputRef} // Connect the reference here
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onClick={handleOpenPicker} // Trigger on left-click anywhere inside the element
        onKeyDown={handleKeyDown}  // Trigger on Space or Enter press
        min={min}
        max={max}
        maxLength={maxLength}
        step={step}
        disabled={disabled}
        className={inputClasses}
        required={required}
        inputMode={inputMode || 'text'}
      />

      {/* Optional Hint Text */}
      {hint && (
        <p
          className={`mt-1.5 text-xs ${error
            ? "text-error-500"
            : success
              ? "text-success-500"
              : "text-gray-500"
            }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;