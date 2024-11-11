import AlgorithmForm from './AlgorithmForm';
import AlgorithmTestForm from './AlgorithmTestForm';

interface IAlgorithmProps {
  data?: IAlgorithm;
}

function Algorithm({ data }: IAlgorithmProps) {
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-3/5'>
          <AlgorithmForm data={data} />
        </div>
        <AlgorithmTestForm />
      </div>
    </div>
  );
}

export default Algorithm;
