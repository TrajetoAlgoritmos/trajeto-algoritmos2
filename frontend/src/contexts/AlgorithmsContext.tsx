'use client';

import { errorToast, successToast } from '@/lib/toasts';
import {
  createAlgorithmService,
  createAlgorithmTestService,
  getAlgorithmByIdService,
  getAlgorithmTestsByAlgorithmIdService,
  getAlgorithmsService,
  removeAlgorithmTestService,
  updateAlgorithmService,
} from '@/services/algorithms';
import { createContext, useCallback, useState } from 'react';

export const AlgorithmsContext = createContext<IAlgorithmContextProps>(
  {} as IAlgorithmContextProps
);

export function AlgorithmsProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [algorithms, setAlgorithms] = useState<IAlgorithmGetResponse>();
  const [currentAlgorithmId, setCurrentAlgorithmId] = useState<number>();
  const [algorithmTests, setAlgorithmTests] = useState<IAlgorithmTest[]>([]);

  const createAlgorithm = useCallback(async (data: IAlgorithm) => {
    try {
      setLoading(true);
      const response = await createAlgorithmService(data);
      if (response?.data?.id) {
        setCurrentAlgorithmId(response.data.id);
      }
      successToast('Algoritmo criado com sucesso!');
    } catch (error) {
      errorToast('Erro ao criar algoritmo!');
    } finally {
      setLoading(false);
    }
  }, []);

  const getAlgorithms = useCallback(async (params: IAlgorithmGetRequest) => {
    try {
      setCurrentAlgorithmId(undefined);
      setAlgorithmTests([]);
      setLoading(true);
      const response = await getAlgorithmsService(params);
      setAlgorithms(response?.data);
    } catch (error) {
      errorToast('Erro ao buscar algoritmos!');
    } finally {
      setLoading(false);
    }
  }, []);

  const getAlgorithmById = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      const response = await getAlgorithmByIdService(id);
      if (!response?.data?.length) return undefined;
      const algorithmId = response.data[0].id;
      setCurrentAlgorithmId(algorithmId);
      const tests = await getAlgorithmTestsByAlgorithmIdService(algorithmId);
      if (tests?.data?.length) {
        setAlgorithmTests(tests.data);
      }
      return response.data[0];
    } catch (error) {
      errorToast('Erro ao buscar algoritmos!');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAlgorithm = useCallback(async (data: IAlgorithm) => {
    try {
      setLoading(true);
      await updateAlgorithmService(data);
      successToast('Algoritmo atualizado com sucesso!');
    } catch (error) {
      errorToast('Erro ao atualizar algoritmo!');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddAlgorithmTest = useCallback(
    async (algorithmTest: IAlgorithmTest) => {
      try {
        setLoading(true);
        const response = await createAlgorithmTestService(algorithmTest);
        setAlgorithmTests((current) => [...current, response.data]);
        successToast('Teste adicionado com sucesso!');
      } catch (error) {
        errorToast('Erro ao adicionar teste!');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleRemoveAlgorithmTest = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await removeAlgorithmTestService(id);
      setAlgorithmTests((current) => current.filter((test) => test.id !== id));
      successToast('Teste removido com sucesso!');
    } catch (error) {
      errorToast('Erro ao remover teste!');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AlgorithmsContext.Provider
      value={{
        loading,
        algorithms,
        currentAlgorithmId,
        algorithmTests,
        getAlgorithms,
        createAlgorithm,
        getAlgorithmById,
        updateAlgorithm,
        handleAddAlgorithmTest,
        handleRemoveAlgorithmTest,
      }}
    >
      {children}
    </AlgorithmsContext.Provider>
  );
}
