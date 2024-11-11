import { Dispatch, SetStateAction } from 'react';

interface CustomInputProps {
  customInput: string | undefined;
  setCustomInput: Dispatch<SetStateAction<string | undefined>>;
}

function CustomInput({ customInput, setCustomInput }: CustomInputProps) {
  return (
    <div className='w-full flex flex-col'>
      <textarea
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        className='w-full rounded-md border-2 border-gray-800 p-2 min-h-[100px]'
        placeholder='Entrada personalizada'
      />
    </div>
  );
}

export default CustomInput;
