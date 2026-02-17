import type {Order} from '~/domain/objects';
import OverviewSection from './Overview';
import * as json from '~/domain/json';
import OrderCard from './OrderCard';

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
      renderItem={order => <OrderCard order={order} />}
    />
  );
}
