'use client';

import Algorithm from '@/components/Teacher/Algorithms/Algorithm';
import { useAlgorithms } from '@/hooks/useAlgorithms';
import { useEffect, useState } from 'react';

function CreateAlgorithmPage({ params: { id } }) {
  const [data, setData] = useState<IAlgorithm>();

  const { getAlgorithmById } = useAlgorithms();

  useEffect(() => {
    async function getAlgorithm() {
      const response = await getAlgorithmById(id);
      setData(response);
    }
    if (id) {
      getAlgorithm();
    }
  }, [id, getAlgorithmById]);

  return <Algorithm data={data} />;
}

export default CreateAlgorithmPage;
