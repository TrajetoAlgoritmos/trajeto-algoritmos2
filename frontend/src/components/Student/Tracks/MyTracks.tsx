import JoinTrack from './JoinTrack';
import MyTracksTable from './MyTracksTable';

function MyTracks() {
  return (
    <div className='flex flex-col w-full gap-4 rounded-xl shadow-xl bg-white p-4'>
      <JoinTrack />
      <MyTracksTable />
    </div>
  );
}

export default MyTracks;
