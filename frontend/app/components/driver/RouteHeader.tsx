import {driverApi} from '~/api/endpoints/driver';
import type {Driver} from '~/domain/objects';
import {formatPhoneNumber} from '~/util/format';
import {useLoader} from '~/util/query';
import LoadBoundary from '../LoadBoundary';

interface Props {
  driverId: Driver['id'];
}

export default function RouteHeader({driverId}: Props) {
  const loader = useLoader(async () => {
    const driver = await driverApi.read(driverId);
    if (!driver) throw new Error('failed to load driver');
    return driver;
  });
  return (
    <LoadBoundary loader={loader} name="driver summary">
      {driver => (
        <header>
          <h1>
            Route for {driver.name} ({formatPhoneNumber(driver.phoneNumber)})
          </h1>
        </header>
      )}
    </LoadBoundary>
  );
}
