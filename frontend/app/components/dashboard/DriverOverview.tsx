import OverviewSection from '../Overview';
import DriverCard from './DriverCard';
import {useContext} from 'react';
import {RestaurantContext} from '../RestaurantProvider';
import {restaurantApi} from '~/api/endpoints/restaurant';
import {useLoader} from '~/util/query';

export default function DriverOverview() {
  const {restaurantId} = useContext(RestaurantContext);

  const loader = useLoader(async () => {
    if (!restaurantId) return null;
    const drivers = await restaurantApi.getDrivers(restaurantId);
    if (!drivers) throw new Error('Failed to load drivers');
    return drivers.filter(driver => driver.onShift);
  }, [restaurantId]);

  return (
    <OverviewSection
      title="🚗 Driver Status"
      itemsLoader={loader}
      renderItem={driver => <DriverCard driver={driver} />}
    />
  );
}
