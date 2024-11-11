import { AlgorithmsContext } from '@/contexts/AlgorithmsContext';
import { useContext } from 'react';

export function useAlgorithms() {
  return useContext(AlgorithmsContext);
}
