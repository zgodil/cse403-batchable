import OverviewSection from '../Overview';
import OrderCard from './OrderCard';
import {restaurantApi} from '~/api/endpoints/restaurant';
import {useContext, useEffect} from 'react';
import {RestaurantContext} from '../RestaurantProvider';
import {OrderRefreshContext} from '../OrderRefreshProvider';
import {useLoader} from '~/util/query';

/**
 * Represents a list of active order summaries, for use on the dashboard page.
 */
export default function OrderOverview() {
  const restaurant = useContext(RestaurantContext);
  const monitor = useContext(OrderRefreshContext);

  // hook into the SSE channel to refresh this overview when orders change
  useEffect(() => {
    monitor?.addEventListener('orderUpdate', () => {
      loader.reload();
    });
  }, [monitor]);

  // loads all active orders, failing quietly on no restaurant and loudly on API errors
  const loader = useLoader(async () => {
    if (!restaurant) return null;
    const orders = await restaurantApi.getOrders(restaurant);
    if (!orders) throw new Error('Failed to load orders');
    return orders;
  }, [restaurant]);

  return (
    <OverviewSection
      title="📦 Active Orders"
      itemsLoader={loader}
      renderItem={order => <OrderCard order={order} />}
    />
  );
}
