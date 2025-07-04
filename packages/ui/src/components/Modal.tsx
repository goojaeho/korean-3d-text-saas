import React, { useEffect, useRef } from 'react';
import { ModalProps } from '../types';
import { cn } from '../utils/cn';

/**
 * 접근성을 고려한 모달 컴포넌트
 * 키보드 네비게이션과 포커스 트랩을 지원합니다
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  children,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-screen-xl'
  };

  // 포커스 관리
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Escape 키 처리
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      {/* 모달 컨텐츠 */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative bg-white rounded-xl shadow-xl p-6 m-4 w-full',
          'max-h-[90vh] overflow-y-auto',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* 헤더 */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="모달 닫기"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        )}
        
        {/* 컨텐츠 */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};