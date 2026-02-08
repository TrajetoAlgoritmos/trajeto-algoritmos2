'use client';

interface Judge0Response {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  status?: {
    id: number;
    description: string;
  };
}

import { useTracks } from '@/hooks/useTracks';
import { defineTheme } from '@/lib/theme/defineTheme';
import { successToast } from '@/lib/toasts';
import { evaluationService, submissionService } from '@/services/submission';
import { finishTrackService, getLastAnswerService } from '@/services/tracks';
import { CODE_ERROR } from '@/utils/constants';
import { PlayIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from 'react-responsive-modal';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import Icon from '../Icon';
import Loading from '../Loading';
import AskFeelingsDrawer from './AskFeelingsDrawer';
import CustomInput from './CustomInput';
import Editor from './Editor';
import Terminal from './Terminal';
import TestCases from './TestCases';
import Track from './Track';

function CodeEditor() {
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<IAlgorithm>();
  const [code, setCode] = useState<string>();
  const [output, setOutput] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [customInput, setCustomInput] = useState<string>();
  const [sizes, setSizes] = useState<number[] | string[]>([
    '25%',
    '50%',
    '25%',
  ]);
  const [evaluationResponse, setEvaluationResponse] =
    useState<IEvaluationResponse>();
  const [evaluationCustomMessage, setEvaluationCustomMessage] =
    useState<string>();
  const [open, setOpen] = useState(false);
  const [startTrack, setStartTrack] = useState(false);
  const [showAskFeelings, setShowAskFeelings] = useState(false);
  const [callback, setCallback] = useState<() => Promise<void>>();

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const { push } = useRouter();
  const { currentTrack } = useTracks();

  const isLastAlgorithm =
    currentTrack?.algorithms[currentTrack?.algorithms.length - 1]?.id ===
    selectedAlgorithm?.id;

  const onChange = useCallback((value: string | undefined) => {
    setCode(value);
  }, []);

  const handleSelectAlgorithm = useCallback(async (algorithm: IAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    const answer = await getLastAnswerService(
      algorithm.track_algorithm_id as number
    );
    if (!answer) {
      setCode(undefined);
    } else {
      setCode(atob(answer.content));
    }
  }, []);

  const resetState = useCallback(() => {
    setErrorMessage(undefined);
    setOutput(undefined);
    setEvaluationCustomMessage(undefined);
    setEvaluationResponse(undefined);
  }, []);

  const handleRunCode = useCallback(async () => {
  if (!code) return;
  try {
    setLoadingRun(true);
    resetState();
    const response = await submissionService({
      stdin: customInput ? btoa(customInput) : '',
      languageId: 75,
      sourceCode: btoa(code),
    });

    const result = response?.data?.data as Judge0Response;
    if (result?.stdout) {
      setOutput(atob(result.stdout));
    } else if (result?.stderr) {
      setErrorMessage(atob(result.stderr)); // <-- erro de execução
    } else if (result?.compile_output) {
      setErrorMessage(atob(result.compile_output)); // <-- erro de compilação (ex: faltou ponto e vírgula)
    } else if (result?.status?.description) {
      setErrorMessage(result.status.description); // <-- fallback: status da submissão
    } else {
      setErrorMessage(CODE_ERROR); // <-- fallback genérico
    }
  } catch (error) {
    console.error(error);
    setErrorMessage(CODE_ERROR); // <-- erro inesperado (ex: falha de rede)
  } finally {
    setLoadingRun(false);
  }
}, [code, customInput, resetState]);


  const handleSave = useCallback(async () => {
    if (!currentTrack?.status && !startTrack) return;
    if (currentTrack?.status === 'finished') return;
    if (!code) return;
    if (!selectedAlgorithm) return;
    try {
      setLoadingEvaluation(true);
      resetState();
      const response = await evaluationService({
        track_algorithms_id: selectedAlgorithm.track_algorithm_id as number,
        languageId: 75,
        content: btoa(code),
      });
      if (response?.data) {
        setEvaluationResponse(response.data);
        const { erros, message } = response.data;
        if (erros?.length) {
          setErrorMessage(CODE_ERROR);
        }
        if (message) {
          setEvaluationCustomMessage(message);
        }
      } else {
        setErrorMessage(CODE_ERROR);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEvaluation(false);
    }
  }, [currentTrack?.status, startTrack, code, selectedAlgorithm, resetState]);

  const handleNext = useCallback(async () => {
    if (!isLastAlgorithm) {
      await handleSave();
      const index = currentTrack?.algorithms.findIndex(
        (algorithm) => algorithm.id === selectedAlgorithm?.id
      );
      if (index === -1 || index === undefined) return;
      setSelectedAlgorithm(currentTrack?.algorithms[index + 1]);
      setCode(undefined);
    } else {
      setShowAskFeelings(true);
    }
  }, [
    isLastAlgorithm,
    currentTrack?.algorithms,
    handleSave,
    selectedAlgorithm?.id,
  ]);

  const handleFinish = useCallback(async () => {
    if (!currentTrack?.userTrackId) return;
    if (!callback) return;
    await callback();
    await handleSave();
    await finishTrackService(currentTrack.userTrackId);
    closeModal();
    push('/aluno');
    successToast('Trilha finalizada com sucesso!');
  }, [callback, closeModal, currentTrack?.userTrackId, handleSave, push]);

  const handleAskFeelingsClose = useCallback(async () => {
    setShowAskFeelings(false);
  }, []);

  useEffect(() => {
    setCustomInput('');
    setOutput('');
  }, [selectedAlgorithm?.id]);

  const renderBoards = useMemo(
    () => (
      <div className='flex-1 flex flex-col md:gap-0 gap-4 md:pl-4 h-[inherit]'>
        <div className='flex-1 flex md:flex-col flex-col-reverse gap-4'>
          <Terminal output={output} errorMessage={errorMessage} />
          <CustomInput
            customInput={customInput}
            setCustomInput={setCustomInput}
          />
          <button
            disabled={loadingRun || loadingEvaluation}
            className='btn btn-primary w-full md:w-auto flex items-center justify-center gap-2 !h-[48px]'
            onClick={handleRunCode}
          >
            {loadingRun ? <Loading /> : <PlayIcon size={24} />}
            Compilar e executar
          </button>
        </div>
        <div className='flex flex-col flex-1 h-full gap-4'>
          <TestCases
            evaluationCustomMessage={evaluationCustomMessage}
            correct={evaluationResponse?.corrects}
            incorrect={evaluationResponse?.incorrects}
          />
          <div
            data-disabled={
              startTrack && currentTrack?.status !== 'finished'
                ? false
                : currentTrack?.status === 'finished' || !currentTrack?.status
            }
            className='w-full flex items-center gap-4 data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none'
          >
            <button
              disabled={loadingEvaluation || loadingRun}
              className='btn btn-secondary  flex-1 md:w-auto flex items-center justify-center gap-2 min-h-[48px] text-white'
              onClick={handleSave}
            >
              {loadingEvaluation ? (
                <Loading />
              ) : (
                <Icon name='Check' size={24} color='#fff' />
              )}
              Salvar
            </button>
            <button
              disabled={loadingEvaluation || loadingRun}
              className='btn bg-blue-500 flex-1 md:w-auto flex items-center justify-center gap-2 min-h-[48px] text-white'
              onClick={handleNext}
            >
              {isLastAlgorithm ? (
                <Icon name='CheckCircle' size={24} color='#fff' />
              ) : (
                <Icon name='ArrowRight' size={24} color='#fff' />
              )}
              {isLastAlgorithm ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    ),
    [
      currentTrack?.status,
      customInput,
      errorMessage,
      evaluationCustomMessage,
      evaluationResponse?.corrects,
      evaluationResponse?.incorrects,
      handleNext,
      handleRunCode,
      handleSave,
      isLastAlgorithm,
      loadingEvaluation,
      loadingRun,
      output,
      startTrack,
    ]
  );

  useEffect(() => {
    defineTheme('oceanic-next');
  }, []);

  useEffect(() => {
    if (currentTrack?.algorithms?.length) {
      setSelectedAlgorithm(currentTrack.algorithms[0]);
    }
  }, [currentTrack?.algorithms]);

  useEffect(() => {
    if (
      currentTrack?.status === 'started' ||
      currentTrack?.status === 'finished'
    ) {
      setStartTrack(true);
    } else {
      setStartTrack(false);
    }
  }, [currentTrack?.status]);

  return (
    <>
      {currentTrack?.id ? (
        <AskFeelingsDrawer
          onSendFeedback={openModal}
          group='END'
          trackId={currentTrack.id}
          isOpen={showAskFeelings}
          setIsOpen={(value) => setShowAskFeelings(value)}
          handleClose={handleAskFeelingsClose}
          setCallback={(_callback) => setCallback(_callback)}
        />
      ) : undefined}
      <Modal
        open={open}
        onClose={closeModal}
        classNames={{
          modal: 'md:w-full md:max-w-[480px]',
        }}
      >
        <div className='flex flex-col gap-4 w-full'>
          <h1 className='font-semibold text-base'>Finalizar trilha?</h1>
          <p>
            Ao finalizar a trilha, você não poderá mais alterar os códigos.{' '}
            <strong>
              Trilhas finalizadas fora do prazo não serão enviadas para
              avaliação.
            </strong>
          </p>
        </div>
        <div className='flex gap-4 mt-4'>
          <button
            className='btn btn-secondary w-full flex items-center justify-center'
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            className='btn btn-primary w-full flex items-center justify-center'
            disabled={loadingEvaluation || loadingRun}
            onClick={handleFinish}
          >
            Confirmar
          </button>
        </div>
      </Modal>
      <div
        style={{
          height: 'calc(100vh - 108px)',
        }}
        className='flex-1 md:flex hidden flex-row items-stretch gap-4'
      >
        <SplitPane
          split='vertical'
          sizes={sizes}
          onChange={(sizes) => setSizes(sizes)}
          sashRender={(_, active) => (
            <div
              data-active={active}
              className='bg-[#1ba48a] h-full w-[2px] data-[active=false]:hidden'
            />
          )}
        >
          <Pane minSize={50} maxSize='50%' className='pr-4'>
            {currentTrack && selectedAlgorithm ? (
              <Track
                startTrack={startTrack}
                track={currentTrack}
                selectedAlgorithm={selectedAlgorithm}
                handleSelectAlgorithm={handleSelectAlgorithm}
                setStartTrack={(value) => setStartTrack(value)}
              />
            ) : undefined}
          </Pane>
          <Editor theme='oceanic-next' onChange={onChange} code={code} />
          {renderBoards}
        </SplitPane>
      </div>
      <div className='flex-1 flex md:hidden flex-col items-stretch gap-4'>
        {currentTrack && selectedAlgorithm ? (
          <Track
            startTrack={startTrack}
            track={currentTrack}
            selectedAlgorithm={selectedAlgorithm}
            handleSelectAlgorithm={handleSelectAlgorithm}
            setStartTrack={(value) => setStartTrack(value)}
          />
        ) : undefined}
        <Editor theme='oceanic-next' onChange={onChange} code={code} />
        {renderBoards}
      </div>
    </>
  );
}

export default CodeEditor;