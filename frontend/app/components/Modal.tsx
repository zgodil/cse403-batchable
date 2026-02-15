import {useLayoutEffect, useRef} from 'react';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
}

export default function Modal({
  open,
  setOpen,
  title,
  children,
}: React.PropsWithChildren<Props>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
