import type {Order} from '~/domain/objects';
import {formatTimeInterval} from '~/util/format';

interface Props {
  order: Order;
}

export default function OrderCard({order}: Props) {
  const prepTime = formatTimeInterval(
    order.cookedTime.getTime() - order.initialTime.getTime(),
  );
  const deliverTime = formatTimeInterval(
    order.deliveryTime.getTime() - order.initialTime.getTime(),
  );
  const items = order.itemNames.join(', ');
  const stateStyle = {
    cooking: 'bg-orange-100 text-orange-700',
    cooked: 'bg-yellow-100 text-yellow-700',
    driving: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
  }[order.state];
  return (
    <>
      <div>
        <p className="font-bold text-gray-900 dark:text-gray-100">
          Order #{order.id.id}
          {order.highPriority && ' ❗'}
        </p>
        <p className="text-sm text-white-500">{order.destination.address}</p>
        <p className="text-sm text-grey-500">{items}</p>
        <p className="text-sm text-gray-500">
          Prepared: {prepTime} • Delivered: {deliverTime}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${stateStyle}`}
      >
        {order.state.toUpperCase()}
      </span>
    </>
  );
}
