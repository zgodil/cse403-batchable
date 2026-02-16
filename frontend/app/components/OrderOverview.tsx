import type {Order} from '~/domain/objects';
import OverviewSection from './Overview';
import * as json from '~/domain/json';
import {formatTimeInterval} from '~/util/format';

export default function OrderList() {
  const jsonOrders: json.JSONDomainObject<Order>[] = [
    {
      id: 5,
      cookedTime: 'Mon, 23 Feb 2026 21:30:00 GMT',
      deliveryTime: 'Mon, 23 Feb 2026 22:00:00 GMT',
      currentBatch: null,
      destination: 'Seattle, WA',
      highPriority: true,
      initialTime: 'Mon, 23 Feb 2026 21:15:00 GMT',
      itemNames: ['Cheeseburger'],
      restaurant: 98123,
      state: 'cooking',
    },
    {
      id: 53,
      cookedTime: 'Mon, 23 Feb 2026 21:00:00 GMT',
      deliveryTime: 'Mon, 23 Feb 2026 21:13:00 GMT',
      currentBatch: null,
      destination: 'Bellevue, WA',
      highPriority: false,
      initialTime: 'Mon, 23 Feb 2026 20:40:00 GMT',
      itemNames: ['Anti-Cheeseburger', 'Anti-Oxygen'],
      restaurant: 98123,
      state: 'delivered',
    },
    {
      id: 95,
      cookedTime: 'Mon, 23 Feb 2026 21:10:00 GMT',
      deliveryTime: 'Mon, 23 Feb 2026 22:00:00 GMT',
      currentBatch: null,
      destination: 'Portland, OR',
      highPriority: false,
      initialTime: 'Mon, 23 Feb 2026 21:05:00 GMT',
      itemNames: ['Cheese Anti-Burger'],
      restaurant: 98123,
      state: 'cooked',
    },
    {
      id: 98386,
      cookedTime: 'Mon, 23 Feb 2026 21:10:00 GMT',
      deliveryTime: 'Mon, 23 Feb 2026 21:50:00 GMT',
      currentBatch: 9,
      destination: '1600 Pennsylvania Avenue, NW, Washington DC',
      highPriority: true,
      initialTime: 'Mon, 23 Feb 2026 20:20:00 GMT',
      itemNames: ['Anti-Cheese', 'Anti-Burger'],
      restaurant: 98123,
      state: 'driving',
    },
  ];
  const orders = jsonOrders.map(json.order.parse);

  return (
    <OverviewSection
      title="📦 Active Orders"
      items={orders}
      onClick={() => {}}
      renderItem={order => {
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
              <p className="text-sm text-white-500">
                {order.destination.address}
              </p>
              <p className="text-sm text-grey-500">{items}</p>
              <p className="text-sm text-gray-500">
                Prepared: {prepTime} • Delivered: {deliverTime}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                stateStyle
              }`}
            >
              {order.state.toUpperCase()}
            </span>
          </>
        );
      }}
    />
  );
}
