import React, { MouseEventHandler } from 'react';
import classNames from 'classnames';

export type TypeButton = 'button' | 'submit' | 'reset';
export type IButtonVariantTypes = 'primary' | 'secondary' | 'tertiary';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

interface ButtonProps {
  id?: string;
  type?: TypeButton;
  children: React.ReactNode;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  round?: boolean;
  className?: string;
  ariaLabel?: string;
  variant?: IButtonVariantTypes;
}

const Button: React.FC<ButtonProps> = ({
  id,
  type = 'button',
  children,
  handleClick,
  disabled = false,
  round = false,
  className,
  ariaLabel,
  variant = 'primary',
}) => {
  const baseClasses = 'button-component transition flex items-center justify-center text-sm font-semibold shadow-blue-500/50';

  const activeVariant = (variant: IButtonVariantTypes): string => {
    switch (variant) {
      case 'secondary':
        return 'button-secondary hover:opacity-60';
      case 'tertiary':
        return 'button-tertiary hover:opacity-60';
      default:
        return 'button-primary hover:opacity-80';
    }
  };

  const buttonClassNames = classNames(
    baseClasses,
    !round ? activeVariant(variant as IButtonVariantTypes) : '',
    {
      'bg-transparent rounded-full p-0 hover:bg-white hover:color-primary hover:opacity-80': round,
      'rounded-lg p-3.5 py-2.5 border border-solid': !round,
    },
    className
  );

  return (
    <button id={id} type={type} onClick={handleClick} disabled={disabled} aria-label={ariaLabel} className={buttonClassNames}>
      {children}
    </button>
  );
};

export default Button;
