'use client';

import Track from '@/components/Teacher/Tracks/Track';
import { useTracks } from '@/hooks/useTracks';
import { useEffect, useState } from 'react';

function CreateTrackPage({ params: { id } }) {
  const [data, setData] = useState<ITrack>();

  const { getTrackById, currentTrack } = useTracks();

  useEffect(() => {
    async function getTrack() {
      await getTrackById(id);
    }
    if (id) {
      getTrack();
    }
  }, [id, getTrackById]);

  useEffect(() => {
    if (currentTrack) {
      setData(currentTrack);
    }
  }, [currentTrack]);

  return <Track data={data} />;
}

export default CreateTrackPage;
