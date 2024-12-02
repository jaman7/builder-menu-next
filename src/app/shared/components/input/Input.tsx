import React from 'react';
import { IInput } from './input.model';
import SearchIcon from '../icons/SearchIcon';
import classNames from 'classnames';
import Button from '../button/Button';
import TrashIcon from '../icons/TrashIcon';

interface IProps {
  name: string;
  config: IInput;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string | null | undefined;
  touched?: boolean;
}

const Input: React.FC<IProps> = ({ name, config, value, onChange, error }) => {
  const { type, placeholder, disabled, min, max, step } = config;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    onChange?.('');
  };

  const inputClasses = classNames(
    'block w-full py-2 px-3 text-base border border-input border-solid rounded-lg transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 relative',
    {
      'pl-[32px] [&::-webkit-search-cancel-button]:hidden': type === 'search',
      'border-red-500 focus:ring-red-500 focus:border-red-500': error && !disabled,
      'active:border-blue-500 active:ring-1 active:ring-blue-500': !error && !disabled, // Active state
      'cursor-not-allowed bg-gray-100': disabled,
    }
  );

  return (
    <div className="block">
      <div className="relative flex flex-col rounded-lg border-0">
        {type === 'search' && (
          <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3">
            <SearchIcon />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type || 'text'}
          placeholder={placeholder || ''}
          value={value ?? ''}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={handleChange}
          className={inputClasses}
          style={{ '--tw-placeholder-color': 'var(--text-placeholder)' } as React.CSSProperties}
          aria-invalid={!!error}
          autoComplete="off"
        />

        {type === 'search' && value !== '' && (
          <Button handleClick={handleClear} round={true} className={classNames('absolute end-2')}>
            <TrashIcon />
          </Button>
        )}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
