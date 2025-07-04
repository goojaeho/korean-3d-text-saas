import { ReactNode, MouseEvent, ChangeEvent } from 'react';

/**
 * 기본 컴포넌트 공통 props
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

/**
 * 버튼 컴포넌트 props
 */
export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * 입력 컴포넌트 props
 */
export interface InputProps extends BaseComponentProps {
  type?: InputType;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

/**
 * 모달 컴포넌트 props
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * 카드 컴포넌트 props
 */
export interface CardProps extends BaseComponentProps {
  variant?: CardVariant;
  padding?: CardPadding;
  shadow?: CardShadow;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export type CardVariant = 'default' | 'outline' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';

/**
 * 폼 관련 타입
 */
export interface FormFieldProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

/**
 * 테마 관련 타입
 */
export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  breakpoints: ThemeBreakpoints;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  text: string;
  background: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}