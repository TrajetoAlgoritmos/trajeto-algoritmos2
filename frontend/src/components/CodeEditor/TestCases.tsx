interface TestCasesProps {
  correct?: IEvalationAnswer[];
  incorrect?: IEvalationAnswer[];
  evaluationCustomMessage?: string;
}

function TestCases({
  correct = [],
  incorrect = [],
  evaluationCustomMessage,
}: TestCasesProps) {
  return (
    <div className='flex w-full h-full flex-col gap-2 mt-2'>
      <h1 className='font-bold text-xl'>Testes</h1>
      <div className='tests-box flex flex-col p-4 h-full rounded-md bg-gray-800 overflow-auto'>
        {evaluationCustomMessage ? (
          <div className='flex flex-col gap-2 mb-4'>
            <h1 className='font-bold text-white'>{evaluationCustomMessage}</h1>
          </div>
        ) : undefined}
        {incorrect?.map(({ id }, index) => (
          <div key={id} className='flex flex-col gap-2'>
            <h1 className='font-bold text-red-500'>
              Teste {index + 1}: falhou
            </h1>
          </div>
        ))}
        {correct?.map(({ id }, index) => (
          <div key={id} className='flex flex-col gap-2'>
            <h1 className='font-bold text-green-500'>
              Teste {index + 1}: passou
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestCases;
