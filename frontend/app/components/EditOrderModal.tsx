import type {Order} from '~/domain/objects';
import Modal, {type ModalState} from './Modal';
import EditControls from './EditControls';

interface Props {
  order: Order;
  state: ModalState;
}

export default function EditOrderModal({order, state}: Props) {
  const applyChanges = () => {
    console.log('Edited Order');
  };

  return (
    <Modal title={`Edit Order #${order.id.id}`} state={state}>
      <form method="dialog" onSubmit={applyChanges}>
        <pre>{JSON.stringify(order, undefined, 4)}</pre>
        <EditControls state={state} />
      </form>
    </Modal>
  );
}
