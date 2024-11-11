function Terminal({ output = '', errorMessage = '' }) {
  return (
    <div className='flex w-full flex-col gap-2'>
      <h1 className='font-bold text-xl'>Saída</h1>
      <div
        data-error={!!errorMessage}
        className='p-4 h-[200px] text-sm rounded-md bg-gray-800 text-green-500 data-[error=true]:text-red-500 whitespace-pre-line overflow-auto'
      >
        {errorMessage || output}
      </div>
    </div>
  );
}

export default Terminal;
