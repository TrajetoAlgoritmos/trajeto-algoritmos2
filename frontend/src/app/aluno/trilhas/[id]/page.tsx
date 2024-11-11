'use client';

import Track from '@/components/Student/Tracks/Track';
import { AlgorithmsProvider } from '@/contexts/AlgorithmsContext';
import { useTracks } from '@/hooks/useTracks';
import { useEffect } from 'react';

function AlgorithmsPage({ params: { id } }) {
  const { getTrackById } = useTracks();

  useEffect(() => {
    if (!id) return;
    getTrackById(id, true);
  }, [id, getTrackById]);

  return (
    <AlgorithmsProvider>
      <Track />
    </AlgorithmsProvider>
  );
}

export default AlgorithmsPage;
