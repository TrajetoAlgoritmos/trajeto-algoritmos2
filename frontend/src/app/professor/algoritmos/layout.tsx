import { AlgorithmsProvider } from '@/contexts/AlgorithmsContext';

function AlgorithmsLayout({ children }) {
  return <AlgorithmsProvider>{children}</AlgorithmsProvider>;
}

export default AlgorithmsLayout;
