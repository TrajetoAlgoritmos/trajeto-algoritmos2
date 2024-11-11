import TrackForm from './TrackForm';
import TrackTabs from './TrackTabs';

interface ITrackProps {
  data?: ITrack;
}

function Track({ data }: ITrackProps) {
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-3/5'>
          <TrackForm data={data} />
        </div>
        <TrackTabs />
      </div>
    </div>
  );
}

export default Track;
