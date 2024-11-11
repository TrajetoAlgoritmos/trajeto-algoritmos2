'use client';

import { sendFeedbackService } from '@/services/feedbacks';
import { feelings } from '@/utils/constants';

interface AskFeelingsDrawerProps {
  trackId: number;
  isOpen: boolean;
  group: 'START' | 'END';
  onSendFeedback: () => Promise<void> | void;
  setIsOpen: (value: boolean) => void;
  handleClose?: () => Promise<void> | void;
  setCallback?: (value: any) => void;
}

function AskFeelingsDrawer({
  trackId,
  isOpen,
  group,
  onSendFeedback,
  setIsOpen,
  handleClose,
  setCallback,
}: AskFeelingsDrawerProps) {
  const onClose = async () => {
    handleClose && (await handleClose());
    setIsOpen(false);
  };

  const handleSendFeedback = async (value: number) => {
    async function sendFeedback() {
      await sendFeedbackService({
        trackId,
        value,
        group,
        algorithmId: null,
      });
    }
    if (setCallback) {
      setCallback(() => sendFeedback);
    } else {
      await sendFeedback();
    }
    await onSendFeedback();
    await onClose();
  };

  return (
    <>
      {isOpen ? (
        <div
          data-open={isOpen}
          className='fixed top-0 right-0 bottom-0 left-0 inset-0 bg-black opacity-20 z-50 duration-300 ease-in-out'
        />
      ) : undefined}
      <div
        data-open={isOpen}
        className='w-full min-h-[152px] flex justify-center items-center fixed bottom-[-100vh] left-0 right-0 z-[9999] shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.1)] bg-white data-[open=true]:bottom-0 duration-300 ease-in-out'
      >
        <div className='flex flex-col items-center gap-4 p-4'>
          <h1 className='text-2xl font-bold mt-2'>
            Que emoji representa você agora?
          </h1>
          <div className='flex gap-2 flex-wrap'>
            {feelings.map((feeling) => (
              <button
                key={feeling.value}
                className='flex-1 hover:scale-95'
                onClick={() => handleSendFeedback(feeling.value)}
              >
                <span className='text-[40px]'>{feeling.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AskFeelingsDrawer;
