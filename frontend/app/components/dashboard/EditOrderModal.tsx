import {
  isStateBefore,
  nextStateAfter,
  ORDER_STATES,
  type Order,
} from '~/domain/objects';
import {type ModalState} from '../Modal';
import FormModal from '../FormModal';
import FormField from '../FormField';
import OrderState from '../OrderState';
import {MS_PER_MINUTE} from '~/util/time';
import {formatOrderName, formatTimeInterval} from '~/util/format';
import {orderApi} from '~/api/endpoints/order';
import Button from '../Button';

interface Props {
  order: Order;
  state: ModalState;
}

/**
 * Represents a modal dialog for editing the post-creation-mutable properties of an Order. See {@link FormModal} for more details on the underlying functionality.
 * @param order The order domain object's current state, prior to any modifications
 * @param state The state of the modal dialog. See {@link ModalState}
 */
export default function EditOrderModal({order, state}: Props) {
  // gather initial data from order object
  const editable = isStateBefore(order.state, 'cooked');
  const cookTime = Math.ceil(
    (order.cookedTime.getTime() - order.initialTime.getTime()) / MS_PER_MINUTE,
  );

  /**
   * Uses form input data (and item names) to edit the order via the API. This is called by {@link FormModal}'s `apply` prop when the form is submitted and the modal closes.
   * @param cookTime A string containing the cooking duration, in minutes from the order's creation time
   * @param state A string containing the order's new {@link Order | state}, unvalidated.
   */
  const applyChanges = async (data: {
    cookTime: string;
    state: Order['state'];
  }) => {
    if (!editable) return;

    // edit cooked time
    const cookedTime = new Date(
      order.initialTime.getTime() + Number(data.cookTime) * MS_PER_MINUTE,
    );
    console.log('Edit Order Cooked Time:', cookedTime);
    if (!(await orderApi.updateCookedTime(order.id, cookedTime))) {
      alert('Failed to edit preparation time');
    }

    // repeatedly advance order state until correct
    let currentState = order.state;
    while (isStateBefore(currentState, data.state)) {
      currentState = nextStateAfter(currentState);
      console.log('Advance Order State:', currentState);
      if (!(await orderApi.advanceState(order.id))) {
        alert('Failed to change order state');
        break;
      }
    }
  };

  /** Remakes the current order via the API */
  const remake = async () => {
    if (await orderApi.remake(order.id)) {
      state.setOpen(false);
    } else {
      alert('Failed to remake order');
    }
  };

  /** Cancels the current order via the API */
  const cancel = async () => {
    if (await orderApi.delete(order.id)) {
      state.setOpen(false);
    } else {
      alert('Failed to cancel order');
    }
  };

  return (
    <FormModal
      title={`Edit ${formatOrderName(order)}`}
      state={state}
      apply={applyChanges}
      confirm={editable ? 'Apply Changes' : 'OK'}
    >
      <div className="flex gap-3">
        <Button style="red" onClick={cancel} tw="grow flex-0">
          Cancel Order
        </Button>
        <Button style="amber" onClick={remake} tw="grow flex-0">
          Remake Order
        </Button>
      </div>
      <div className="text-sm text-gray-500">
        <p>Items: {order.itemNames.join(', ')}</p>
        <p>
          Destination: <b>{order.destination.address}</b>{' '}
          {formatTimeInterval(order.deliveryTime.getTime() - Date.now())}
        </p>
      </div>
      {editable && (
        <FormField
          label="Prep Time (min)"
          type="number"
          name="cookTime"
          defaultValue={cookTime}
        />
      )}
      {editable ? (
        ORDER_STATES.filter(state => {
          return isStateBefore(state, nextStateAfter('cooked'));
        }).map(state => {
          const disabled = isStateBefore(state, order.state);
          return (
            <FormField
              label={<OrderState state={state} disabled={disabled} />}
              type="radio"
              name="state"
              key={state}
              value={state}
              disabled={disabled}
              defaultChecked={order.state === state}
            />
          );
        })
      ) : (
        <OrderState state={order.state} />
      )}
    </FormModal>
  );
}
