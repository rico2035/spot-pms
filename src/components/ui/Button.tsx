import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  to?: never;
};

type ButtonLinkProps = BaseButtonProps & LinkProps & {
  to: string;
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  fullWidth,
  to,
  children,
  disabled,
  className,
  ...props
}: ButtonProps | ButtonLinkProps) {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus:ring-neutral-500',
    outline: 'border border-neutral-300 text-neutral-800 hover:bg-neutral-50 focus:ring-neutral-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  }[size];

  const commonClasses = `
    inline-flex items-center justify-center 
    rounded-md font-medium transition-colors 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''}
    ${variantClasses}
    ${sizeClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className || ''}
  `;

  const content = (
    <>
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </>
  );

  // If a to prop is provided, render as a Link
  if (to) {
    const { variant, size, icon, isLoading, fullWidth, ...linkProps } = props as ButtonLinkProps;
    return (
      <Link className={commonClasses} {...linkProps}>
        {content}
      </Link>
    );
  }

  // Otherwise, render as a button
  return (
    <button className={commonClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
}