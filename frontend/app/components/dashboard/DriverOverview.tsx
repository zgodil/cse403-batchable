import OverviewSection from '../Overview';
import DriverCard from './DriverCard';
import {useContext} from 'react';
import {RestaurantContext} from '../RestaurantProvider';
import {restaurantApi} from '~/api/endpoints/restaurant';
import {useLoader} from '~/util/query';

/**
 * Represents a list of on-shift driver summaries, for use on the dashboard page.
 */
export default function DriverOverview() {
  const restaurant = useContext(RestaurantContext);

  // loads on-shift drivers, failing quietly with no restaurant and loudly with API errors
  const loader = useLoader(async () => {
    if (!restaurant) return null;
    const drivers = await restaurantApi.getDrivers(restaurant);
    if (!drivers) throw new Error('Failed to load drivers');
    return drivers.filter(driver => driver.onShift);
  }, [restaurant]);

  return (
    <OverviewSection
      title="🚗 Driver Status"
      itemsLoader={loader}
      renderItem={driver => <DriverCard driver={driver} />}
    />
  );
}
