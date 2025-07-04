import React from 'react';
import { InputProps } from '../types';
import { cn } from '../utils/cn';

/**
 * 재사용 가능한 입력 컴포넌트
 * 유효성 검사와 에러 표시를 지원합니다
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    type = 'text',
    error,
    label,
    helperText,
    className,
    disabled = false,
    required = false,
    value,
    onChange,
    placeholder,
    ...props
  }, ref) => {
    const hasError = Boolean(error);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    };
    
    const inputStyles = cn(
      'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-gray-500',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      hasError 
        ? 'border-red-300 focus-visible:ring-red-500' 
        : 'border-gray-300 focus-visible:ring-primary-500',
      className
    );

    const labelStyles = cn(
      'text-sm font-medium leading-none',
      hasError ? 'text-red-700' : 'text-gray-700',
      disabled && 'opacity-50'
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className={labelStyles}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputStyles}
          aria-invalid={hasError}
          aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
          {...props}
        />
        
        {error && (
          <p 
            id="error-message" 
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id="helper-text" 
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';