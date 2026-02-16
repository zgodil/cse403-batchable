import type {Order} from '~/domain/objects';
import Modal, {type ModalState} from './Modal';

interface Props extends ModalState {
  order: Order;
  modal: ModalState;
}

export default function EditOrderModal({order, modal}: Props) {
  return (
    <Modal title={`Edit Order #${order.id.id}`} state={modal}>
      Woah Woah 2
    </Modal>
  );
}
