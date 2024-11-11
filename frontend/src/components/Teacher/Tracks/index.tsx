import Icon from '@/components/Icon';
import Link from 'next/link';
import TracksTable from './TracksTable';

function Tracks() {
  return (
    <div className='shadow-xl bg-white p-4 rounded-xl'>
      <Link href='/professor/trilhas/criar' className='inline-block'>
        <button className='btn btn-primary gap-2'>
          <Icon name='Plus' size={24} color='#fff' />
          <span>Criar trilha</span>
        </button>
      </Link>
      <TracksTable />
    </div>
  );
}

export default Tracks;
