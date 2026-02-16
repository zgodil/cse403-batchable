import Button from './Button';
import type {ModalState} from './Modal';

interface Props {
  state: ModalState;
  confirm?: string;
}

export default function EditControls({
  state,
  confirm = 'Apply Changes',
}: Props) {
  return (
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
  );
}
