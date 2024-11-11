import Icon from '@/components/Icon';
import Link from 'next/link';
import AlgorithmsTable from './AlgorithmsTable';

function Algorithms() {
  return (
    <div className='shadow-xl bg-white p-4 rounded-xl'>
      <Link href='/professor/algoritmos/criar' className='inline-block'>
        <button className='btn btn-primary gap-2'>
          <Icon name='Plus' size={24} color='#fff' />
          <span>Criar algoritmo</span>
        </button>
      </Link>
      <AlgorithmsTable />
    </div>
  );
}

export default Algorithms;
