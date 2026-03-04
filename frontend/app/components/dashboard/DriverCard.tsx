import type {Driver} from '~/domain/objects';
import {formatDriverName, formatPhoneNumber} from '~/util/format';
import Card from '../Card';
import DriverRoute from './DriverRoute';

interface Props {
  driver: Driver;
}

export default function DriverCard({driver}: Props) {
  return (
    <>
      <Card>
        <div className="flex justify-between items-startr flex-col">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">
            {formatDriverName(driver)}
          </h2>

          <p className="text-xs font-medium text-blue-500">
            {formatPhoneNumber(driver.phoneNumber)}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          <span className="mr-2">Route:</span>
          <DriverRoute driverId={driver.id} />
        </div>
      </Card>
    </>
  );
}
