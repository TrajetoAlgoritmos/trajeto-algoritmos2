import { AlgorithmsProvider } from '@/contexts/AlgorithmsContext';
import { TracksProvider } from '@/contexts/TracksContext';

function TracksLayout({ children }) {
  return (
    <TracksProvider>
      <AlgorithmsProvider>{children}</AlgorithmsProvider>
    </TracksProvider>
  );
}

export default TracksLayout;
