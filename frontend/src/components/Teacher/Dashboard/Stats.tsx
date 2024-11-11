function Stats() {
  return (
    <div className='w-full grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4'>
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <h3 className='text-lg font-semibold'>Alunos</h3>
        <p className='text-2xl font-semibold mt-2'>100</p>
      </div>
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <h3 className='text-lg font-semibold'>Trilhas</h3>
        <p className='text-2xl font-semibold mt-2'>8</p>
      </div>
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <h3 className='text-lg font-semibold'>Algoritmos</h3>
        <p className='text-2xl font-semibold mt-2'>89</p>
      </div>
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <h3 className='text-lg font-semibold'>Perguntas e Respostas</h3>
        <p className='text-2xl font-semibold mt-2'>230</p>
      </div>
    </div>
  );
}

export default Stats;
