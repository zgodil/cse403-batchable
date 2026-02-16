import type {Driver} from '~/domain/objects';
import type {ModalState} from './Modal';
import Modal from './Modal';
import EditControls from './EditControls';

interface Props {
  driver: Driver;
  state: ModalState;
}

export default function EditDriverModal({driver, state}: Props) {
  const applyChanges = () => {
    console.log('Edited Driver');
  };

  return (
    <Modal title={`Edit Driver '${driver.name}'`} state={state}>
      <form method="dialog" onSubmit={applyChanges}>
        <pre>{JSON.stringify(driver, undefined, 4)}</pre>
        <EditControls state={state} />
      </form>
    </Modal>
  );
}
