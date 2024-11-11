'use client';

import { errorToast, successToast } from '@/lib/toasts';
import {
  addAlgorithmToTrackService,
  createTrackService,
  getJoinedTracksService,
  getStudentTrackService,
  getTrackByIdService,
  getTracksService,
  joinTrackService,
  removeAlgorithmToTrackService,
  updateTrackService,
} from '@/services/tracks';
import { createContext, useCallback, useState } from 'react';

export const TracksContext = createContext<ITrackContextProps>(
  {} as ITrackContextProps
);

export function TracksProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<ITrackGetResponse>();
  const [currentTrack, setCurrentTrack] = useState<ITrack>();
  const [joinedTracks, setJoinedTracks] = useState<ITrackGetResponse>();

  const createTrack = useCallback(async (data: ITrack) => {
    try {
      setLoading(true);
      const response = await createTrackService(data);
      if (response?.data?.id) {
        setCurrentTrack(response.data);
      }
      successToast('Algoritmo criado com sucesso!');
    } catch {
      errorToast('Erro ao criar track!');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTracks = useCallback(async (params: ITrackGetRequest) => {
    try {
      setCurrentTrack(undefined);
      setLoading(true);
      const response = await getTracksService(params);
      setTracks(response?.data);
    } catch {
      errorToast('Erro ao buscar tracks!');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrackById = useCallback(
    async (id: string | number, student?: boolean) => {
      try {
        setLoading(true);
        const getData = () =>
          student ? getStudentTrackService(id) : getTrackByIdService(id);
        const response = await getData();
        if (!response?.data) return;
        setCurrentTrack(response.data);
      } catch {
        errorToast('Erro ao buscar tracks!');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateTrack = useCallback(async (data: ITrack) => {
    try {
      setLoading(true);
      await updateTrackService(data);
      successToast('Algoritmo atualizado com sucesso!');
    } catch {
      errorToast('Erro ao atualizar track!');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddAlgorithmToTrack = useCallback(
    async (trackId: number, algorithmId: number) => {
      try {
        setLoading(true);
        await addAlgorithmToTrackService(trackId, algorithmId);
        const track = await getTrackByIdService(trackId);
        setCurrentTrack(track.data);
        successToast('Algoritmo adicionado com sucesso!');
      } catch {
        errorToast('Erro ao adicionar algoritmo!');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleRemoveAlgorithmToTrack = useCallback(
    async (trackId: number, algorithmId: number) => {
      try {
        setLoading(true);
        await removeAlgorithmToTrackService(trackId, algorithmId);
        const track = await getTrackByIdService(trackId);
        setCurrentTrack(track.data);
        successToast('Algoritmo removido com sucesso!');
      } catch {
        errorToast('Erro ao remover algoritmo!');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleJoinTrack = useCallback(async (code: string) => {
    try {
      setLoading(true);
      await joinTrackService(code);
      successToast('Entrou na trilha com sucesso!');
    } catch {
      errorToast('Erro ao entrar na trilha!');
    } finally {
      setLoading(false);
    }
  }, []);

  const getJoinedTracks = useCallback(async (params: ITrackGetRequest) => {
    try {
      setLoading(true);
      const response = await getJoinedTracksService(params);
      setJoinedTracks(response?.data);
    } catch {
      errorToast('Erro ao buscar trilhas!');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TracksContext.Provider
      value={{
        loading,
        tracks,
        currentTrack,
        joinedTracks,
        getTracks,
        createTrack,
        getTrackById,
        updateTrack,
        handleAddAlgorithmToTrack,
        handleRemoveAlgorithmToTrack,
        handleJoinTrack,
        getJoinedTracks,
      }}
    >
      {children}
    </TracksContext.Provider>
  );
}
