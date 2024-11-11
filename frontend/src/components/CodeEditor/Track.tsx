import { startTrackService } from '@/services/tracks';
import parse from 'html-react-parser';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '../Icon';
import AskFeelingsDrawer from './AskFeelingsDrawer';

interface ITrackProps {
  track: ITrack;
  selectedAlgorithm: IAlgorithm;
  startTrack: boolean;
  handleSelectAlgorithm: (algorithm: IAlgorithm) => void;
  setStartTrack: (value: boolean) => void;
}

function Track({
  track: { id: trackId, title, description, algorithms, status, userTrackId },
  selectedAlgorithm,
  startTrack,
  setStartTrack,
  handleSelectAlgorithm,
}: ITrackProps) {
  const [showAskFeelings, setShowAskFeelings] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSelected = (id: number) => id === selectedAlgorithm?.id;

  const handleStartTrack = async () => {
    try {
      setLoading(true);
      if (status === 'started') return;
      if (status === 'finished') return;
      if (userTrackId) {
        await startTrackService(userTrackId);
      }
      setShowAskFeelings(true);
      setStartTrack(true);
      handleSelectAlgorithm(algorithms[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (algorithms?.length) {
      handleSelectAlgorithm(algorithms[0]);
    }
  }, [algorithms, handleSelectAlgorithm]);

  useEffect(() => {
    if (!startTrack && (status === 'started' || status === 'finished')) {
      setStartTrack(true);
    }
  }, [setStartTrack, startTrack, status]);

  return (
    <>
      <AskFeelingsDrawer
        group='START'
        onSendFeedback={handleStartTrack}
        trackId={trackId}
        isOpen={showAskFeelings}
        setIsOpen={(value) => setShowAskFeelings(value)}
      />
      <div className='relative flex flex-col flex-1 p-2 border-2 border-gray-800 rounded-md bg-white h-[inherit]'>
        <h1 className='text-center font-medium text-xl'>{title}</h1>
        {!startTrack ? (
          <div className='w-full overflow-y-auto p-2 mt-2 mb-[72px]'>
            <p className='text-sm text-gray-800 mt-2'>{parse(description)}</p>
          </div>
        ) : (
          <div className='w-full flex flex-col overflow-y-auto mb-[72px] gap-6'>
            {algorithms.map((algorithm, index) => (
              <div className='w-full flex flex-col gap-1' key={algorithm.id}>
                <h1
                  data-selected={isSelected(algorithm.id)}
                  className='data-[selected=true]:font-bold'
                >
                  Exercício {index + 1}
                </h1>
                <div
                  role='button'
                  data-selected={isSelected(algorithm.id)}
                  className='w-full bg-gray-100 p-2 rounded-md data-[selected=true]:bg-[#1ba48b2f] data-[selected=true]:shadow-[inset_0_0_0_3px_#1ba48b] cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-200'
                  onClick={() => handleSelectAlgorithm(algorithm)}
                >
                  <h1 className='text-base font-medium'>{algorithm.title}</h1>
                  <p className='text-sm text-gray-800 mt-2'>
                    {parse(algorithm.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!startTrack ? (
          <button
            disabled={loading || status === 'finished'}
            className='absolute-center flex justify-center items-center text-white bottom-4 btn bg-blue-500 w-[80%] max-w-[300px] mt-4'
            onClick={() => setShowAskFeelings(true)}
          >
            {loading ? 'Carregando...' : 'Iniciar trilha'}
          </button>
        ) : (
          <Link href='/aluno'>
            <button className='absolute-center flex justify-center items-center gap-1 text-white bottom-4 btn bg-blue-500 w-[80%] max-w-[300px] mt-4'>
              <Icon name='ArrowLeft' size={24} color='#fff' />
              <span>Voltar para trilhas</span>
            </button>
          </Link>
        )}
      </div>
    </>
  );
}

export default Track;
