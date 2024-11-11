'use client';

import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  name: string;
  control: any;
  label?: string;
  error?: string;
  isRequired?: boolean;
}

function Editor({ label, error, isRequired, name, control }: EditorProps) {
  return (
    <div className='relative flex flex-col w-full gap-1 data-[focused=true]:border-[#20695c] box-border'>
      {label && (
        <label className='font-medium'>
          {label}
          {isRequired ? (
            <span className='text-[#fe0000]'>{' *'}</span>
          ) : undefined}
        </label>
      )}
      <Controller
        render={({ field }) => (
          <ReactQuill
            theme='snow'
            className='rounded-xl'
            value={field.value as string}
            onChange={field.onChange}
          />
        )}
        name={name}
        control={control}
      />
      {error && (
        <span className='absolute top-[100%] font-medium text-[#fe0000] text-xs'>
          {error}
        </span>
      )}
    </div>
  );
}

export default Editor;
