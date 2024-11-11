'use client';

import { InputHTMLAttributes, forwardRef, useId, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isRequired?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, isRequired, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const id = useId();

    return (
      <div
        data-focused={isFocused}
        className='relative flex flex-col w-full gap-1 data-[focused=true]:border-[#20695c] box-border'
      >
        {label && (
          <label htmlFor={id} className='font-medium'>
            {label}
            {isRequired ? (
              <span className='text-[#fe0000]'>{' *'}</span>
            ) : undefined}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          {...props}
          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#20695c] h-10'
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {error && (
          <span className='text-xs font-medium text-[#fe0000] absolute top-[100%]'>
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default Input;
