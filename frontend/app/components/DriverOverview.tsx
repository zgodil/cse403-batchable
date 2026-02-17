import OverviewSection from './Overview';
import * as json from '~/domain/json';
import type {Driver} from '~/domain/objects';
import DriverCard from './DriverCard';

export default function DriverOverview() {
  const jsonDrivers: json.JSONDomainObject<Driver>[] = [
    {
      id: 982,
      name: 'Ben',
      onShift: true,
      phoneNumber: '2069994273',
      restaurant: 98123,
    },
    {
      id: 129,
      name: 'Delano',
      onShift: false,
      phoneNumber: '1978176237',
      restaurant: 98123,
    },
  ];

  const drivers = jsonDrivers.map(json.driver.parse);

  return (
    <OverviewSection
      title="🚗 Driver Status"
      items={drivers}
      renderItem={driver => <DriverCard driver={driver} />}
    />
  );
}
