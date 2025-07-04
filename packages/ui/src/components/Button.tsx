import React from 'react';
import { ButtonProps } from '../types';
import { cn } from '../utils/cn';

/**
 * 재사용 가능한 버튼 컴포넌트
 * 다양한 variant와 size를 지원합니다
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    className,
    children,
    onClick,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variantStyles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
      secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus-visible:ring-secondary-500',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500',
      ghost: 'hover:bg-gray-100 focus-visible:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-4 text-sm rounded-lg',
      lg: 'h-12 px-6 text-base rounded-lg',
      xl: 'h-14 px-8 text-lg rounded-xl'
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      onClick?.();
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <svg 
            className="w-4 h-4 mr-2 animate-spin" 
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              className="opacity-25"
            />
            <path 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';