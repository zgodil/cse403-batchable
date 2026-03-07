import OrderRefreshProvider from '~/components/OrderRefreshProvider';
import type {Route} from './+types/driver';
import {useLoader} from '~/util/query';
import {driverApi} from '~/api/endpoints/driver';
import DriverPage from '~/components/driver/DriverPage';
import LoadBoundary from '~/components/LoadBoundary';
import {DriverTokenContext} from '~/components/driver/DriverTokenContext';

export default function Route({params: {token}}: Route.ComponentProps) {
  const loader = useLoader(async () => {
    const driver = await driverApi.fromToken(token);
    if (!driver) throw new Error('failed to load driver by token');
    return driver;
  });

  return (
    <OrderRefreshProvider>
      <DriverTokenContext value={token}>
        <div className="p-5">
          <LoadBoundary loader={loader} name="driver dashboard">
            {driverId => <DriverPage driverId={driverId} />}
          </LoadBoundary>
        </div>
      </DriverTokenContext>
    </OrderRefreshProvider>
  );
}
