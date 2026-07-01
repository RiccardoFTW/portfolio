export type ToastData = {
  id: number;
  title: string;
  description?: string;
  titleColor?: string;
};

export type ToastOptions = {
  description?: string;
  titleColor?: string;
};

type Listener = () => void;

const MAX_VISIBLE_TOASTS = 3;
const TOAST_AUTO_DISMISS_DELAY = 4000;

let toasts: ToastData[] = [];
let nextToastId = 0;
const listeners = new Set<Listener>();
const EMPTY_TOASTS: ToastData[] = [];

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToastsSnapshot() {
  return toasts;
}

export function getToastsServerSnapshot(): ToastData[] {
  return EMPTY_TOASTS;
}

function removeToast(toastId: number) {
  toasts = toasts.filter((toast) => toast.id !== toastId);
  emitChange();
}

export function addToast(title: string, options?: ToastOptions) {
  nextToastId += 1;

  const toastId = nextToastId;

  toasts = [
    ...toasts.slice(-(MAX_VISIBLE_TOASTS - 1)),
    {
      id: toastId,
      title,
      description: options?.description,
      titleColor: options?.titleColor,
    },
  ];
  emitChange();

  window.setTimeout(() => {
    removeToast(toastId);
  }, TOAST_AUTO_DISMISS_DELAY);

  return toastId;
}
