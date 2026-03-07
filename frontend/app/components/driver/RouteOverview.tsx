import {useContext, useEffect} from 'react';
import {OrderRefreshContext} from '../OrderRefreshProvider';
import {useLoader} from '~/util/query';
import type {Driver} from '~/domain/objects';
import {driverApi} from '~/api/endpoints/driver';
import {batchApi} from '~/api/endpoints/batch';
import RouteItem from './RouteItem';
import LoadBoundary from '../LoadBoundary';
import ReturnedButton from './ReturnedButton';

interface Props {
  driverId: Driver['id'];
}

export default function RouteOverview({driverId}: Props) {
  const refresher = useContext(OrderRefreshContext);

  const loader = useLoader(async () => {
    const batch = await driverApi.getBatch(driverId);
    if (!batch) throw new Error('failed to read batch');
    const orders = await batchApi.getOrders(batch.id);
    if (!orders) throw new Error('failed to load orders');
    return orders;
  });

  useEffect(() => {
    if (!refresher) return;
    const listener = () => loader.reload();
    refresher.addEventListener('orderUpdate', listener);
    return () => {
      refresher.removeEventListener('orderUpdate', listener);
    };
  }, [refresher]);

  return (
    <main>
      <ol>
        <LoadBoundary loader={loader} name="orders">
          {orders =>
            orders.map(order => <RouteItem order={order} key={order.id.id} />)
          }
        </LoadBoundary>
      </ol>
      <ReturnedButton />
    </main>
  );
}
