import OverviewSection from './Overview';
import {parseDriver, type JSONDomainObject} from '~/domain/json';
import type {Driver} from '~/domain/objects';
import {formatPhoneNumber} from '~/util/format';

export default function DriverOverview() {
  const jsonDrivers: JSONDomainObject<Driver>[] = [
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

  const drivers = jsonDrivers.map(parseDriver);

  return (
    <OverviewSection
      title="🚗 Driver Status"
      items={drivers}
      onClick={() => {}}
      renderItem={driver => (
        <>
          <div className="flex justify-between items-startr flex-col">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">
              {driver.name}
            </h2>

            <p className="text-xs font-medium text-blue-500">
              {formatPhoneNumber(driver.phoneNumber)}
            </p>
          </div>
          <p
            className={`text-sm text-gray-500 ${
              driver.onShift ? 'text-green-200' : 'text-red-600'
            }`}
          >
            Status: {driver.onShift ? 'ON' : 'OFF'} SHIFT
          </p>
        </>
      )}
    />
  );
}
