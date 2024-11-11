import { ToastOptions, toast } from 'react-toastify';

const config: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export function successToast(message: string) {
  toast.success(message, config);
}

export function errorToast(message: string) {
  toast.error(message, config);
}
