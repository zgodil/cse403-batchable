import type {Driver} from '~/domain/objects';
import {formatPhoneNumber} from '~/util/format';

interface Props {
  driver: Driver;
}

export default function DriverCard({driver}: Props) {
  return (
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
  );
}
