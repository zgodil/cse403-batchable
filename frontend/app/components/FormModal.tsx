import Button from './Button';
import type {ModalState} from './Modal';
import Modal from './Modal';

interface FormData {
  [k: string]: string;
}

interface Props<T extends FormData> {
  title: string;
  state: ModalState;
  confirm?: string;
  apply: (data: T) => void;
}

export default function FormModal<T extends FormData>({
  state,
  confirm = 'Apply Changes',
  apply,
  children,
  title,
}: React.PropsWithChildren<Props<T>>) {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as T;
    apply(data);
  };
  return (
    <Modal state={state} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4" method="dialog">
        {children}
        <div className="mt-6 flex gap-3 w-full">
          <Button
            style="secondary"
            onClick={() => state.setOpen(false)}
            tw="flex-0 grow"
          >
            Cancel
          </Button>
          <Button style="primary" submit tw="flex-0 grow">
            {confirm}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
