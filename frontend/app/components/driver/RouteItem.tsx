import {useContext} from 'react';
import {type Order} from '~/domain/objects';
import {DriverTokenContext} from '../DriverTokenContext';
import Button from '../Button';
import {formatOrderName} from '~/util/format';
import {orderApi} from '~/api/endpoints/order';

interface Props {
  order: Order;
}

/**
 * Represents one item in a driver's batch. It allows that order to be delivered.
 * @param order The order in the driver's batch. May be delivered
 */
export default function RouteItem({order}: Props) {
  const token = useContext(DriverTokenContext);

  /** Delivers the order via the API */
  const deliverOrder = async () => {
    if (!token || !(await orderApi.markDelivered(order.id, token))) {
      alert('Failed to mark order as delivered');
    }
  };

  const delivered = order.state === 'delivered';

  return (
    <li className="self-stretch">
      <Button onClick={delivered ? undefined : deliverOrder} tw="w-full">
        {delivered ? '✔️ Delivered' : 'Deliver'} {formatOrderName(order)}
      </Button>
    </li>
  );
}
