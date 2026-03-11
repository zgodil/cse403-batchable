import RouteOverview from './RouteOverview';
import RouteHeader from './RouteHeader';
import {useContext, useEffect} from 'react';
import {OrderRefreshContext} from '../OrderRefreshProvider';
import {useLoader} from '~/util/query';
import {driverApi} from '~/api/endpoints/driver';
import {DriverTokenContext} from '../DriverTokenContext';
import LoadBoundary from '../LoadBoundary';

/**
 * Represents the entire overview of the driver's route as shown on `/route/:token`. This presumes access to `OrderRefreshContext` and `DriverTokenContext`. This page can be used to deliver orders and complete the route. It can be re-used across multiple batches.
 */
export default function DriverPage() {
  const refresher = useContext(OrderRefreshContext);
  const token = useContext(DriverTokenContext);

  // loads the driver's route summary. fails quietly on no token, and fails loudly on API errors
  const loader = useLoader(async () => {
    if (!token) return null;
    const route = await driverApi.getRouteInfo(token);
    if (!route) throw new Error('failed to load driver info by token');
    return route;
  }, [token]);

  // synchronizes route summary loading with order updates
  useEffect(() => {
    if (!refresher) return;
    const onUpdate = () => loader.reload();
    refresher.addEventListener('orderUpdate', onUpdate);
    return () => {
      refresher.removeEventListener('orderUpdate', onUpdate);
    };
  }, [refresher]);

  return (
    <LoadBoundary loader={loader} name="route dashboard">
      {route => (
        <>
          <RouteHeader driver={route.driver} />
          <RouteOverview orders={route.orders} mapLink={route.mapLink} />
        </>
      )}
    </LoadBoundary>
  );
}
