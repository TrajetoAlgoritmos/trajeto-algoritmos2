import { TracksContext } from '@/contexts/TracksContext';
import { useContext } from 'react';

export function useTracks() {
  return useContext(TracksContext);
}
