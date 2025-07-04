import React from 'react';
import { CardProps } from '../types';
import { cn } from '../utils/cn';

/**
 * 재사용 가능한 카드 컴포넌트
 * 다양한 스타일과 패딩 옵션을 제공합니다
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default',
    padding = 'md',
    shadow = 'md',
    className,
    children,
    onClick,
    ...props
  }, ref) => {
    const baseStyles = 'rounded-lg transition-colors';
    
    const variantStyles = {
      default: 'bg-white border border-gray-200',
      outline: 'bg-transparent border border-gray-300',
      ghost: 'bg-gray-50 border-0'
    };

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };

    const shadowStyles = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };

    const interactiveStyles = onClick ? 'cursor-pointer hover:shadow-lg hover:border-gray-300' : '';

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          shadowStyles[shadow],
          interactiveStyles,
          className
        )}
        onClick={handleClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * 카드 헤더 컴포넌트
 */
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('mb-4 pb-2 border-b border-gray-200', className)}>
    {children}
  </div>
);

/**
 * 카드 제목 컴포넌트
 */
export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

/**
 * 카드 설명 컴포넌트
 */
export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={cn('text-sm text-gray-600 mt-1', className)}>
    {children}
  </p>
);

/**
 * 카드 컨텐츠 컴포넌트
 */
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('', className)}>
    {children}
  </div>
);

/**
 * 카드 푸터 컴포넌트
 */
export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
);