import OverviewSection from '../Overview';
import OrderCard from './OrderCard';
import {restaurantApi} from '~/api/endpoints/restaurant';
import {useContext, useEffect} from 'react';
import {RestaurantContext} from '../RestaurantProvider';
import {OrderRefreshContext} from '../OrderRefreshProvider';
import {useLoader} from '~/util/query';

export default function OrderOverview() {
  const {restaurantId} = useContext(RestaurantContext);
  const monitor = useContext(OrderRefreshContext);

  useEffect(() => {
    monitor?.addEventListener('orderUpdate', () => {
      loader.reload();
    });
  }, [monitor]);

  const loader = useLoader(async () => {
    if (!restaurantId) return null;
    const orders = await restaurantApi.getOrders(restaurantId);
    if (!orders) throw new Error('Failed to load orders');
    return orders;
  }, [restaurantId]);

  return (
    <OverviewSection
      title="📦 Active Orders"
      itemsLoader={loader}
      renderItem={order => <OrderCard order={order} />}
    />
  );
}
