"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "motion/react";

import { Toast } from "@/components/toast/Toast";
import {
  addToast,
  getToastsServerSnapshot,
  getToastsSnapshot,
  subscribeToasts,
} from "@/components/toast/toast-store";

const emptySubscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function handleAddDemoToast() {
  addToast("Ehi!", { description: "This is a toast component!" });
}

export function ToastStack() {
  const toasts = useSyncExternalStore(
    subscribeToasts,
    getToastsSnapshot,
    getToastsServerSnapshot,
  );
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.button
        aria-label="Add toast"
        className="inline-flex h-12 items-center justify-center rounded-full bg-article-accent px-5 font-sans text-lg leading-6 font-medium text-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.08)] outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:brightness-95 focus-visible:ring-2 focus-visible:ring-article-accent focus-visible:ring-offset-2 focus-visible:ring-offset-(--component-surface)"
        type="button"
        onClick={handleAddDemoToast}
        whileTap={{ scale: 0.97 }}
      >
        Add toast
      </m.button>

      {isMounted
        ? createPortal(
          <div
            aria-live="polite"
            className="pointer-events-none fixed top-4 right-4 z-50 max-w-[calc(100vw-2rem)]"
          >
            <div className="relative min-h-16">
              <AnimatePresence initial={false}>
                {toasts.map((toast, toastIndex) => (
                  <Toast
                    key={toast.id}
                    index={toasts.length - toastIndex - 1}
                    title={toast.title}
                    description={toast.description}
                    titleColor={toast.titleColor}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>,
          document.body,
        )
        : null}
    </LazyMotion>
  );
}
