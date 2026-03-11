import {useLayoutEffect, useRef, useState} from 'react';

/**
 * Represents the state of a modal dialog. This should be acquired via the {@link useModal} hook, and should be held by some ancestor component of the modal dialog. When passing this interface through props, if the target component is a specific type of modal, the prop should be called `state`. If the target component simply contains a modal, it should be called `modal`.
 */
export interface ModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface Props {
  title: string;
  state: ModalState;
}

/**
 * A custom hook for getting a ModalState object associated with a closed modal.
 * This can be used to control one or more modal children.
 * @param initiallyOpen Whether the modal should begin by opening
 * @returns The new modal state, closed
 */
export function useModal(initiallyOpen = false): ModalState {
  const [open, setOpen] = useState(initiallyOpen);
  return {open, setOpen};
}

/**
 * Determines whether any modal is currently open
 */
export function anyModalOpen(): boolean {
  return document.querySelector('dialog:modal') !== null;
}

/**
 * Represents a modal dialog box, implemented on top of the native HTML <dialog> element for maximal native support.
 * @param state The state of the modal, and the ability to change it. The setter is required in this to facilitate the modal's inherent autoclosing abilities
 * @param title The title of the modal, to display before all the other children
 * @param children The content of the modal
 */
export default function Modal({
  state: {open, setOpen},
  title,
  children,
}: React.PropsWithChildren<Props>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // synchronizes the state of the <dialog> element with the state prop
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 m-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      {open && children}
    </dialog>
  );
}
