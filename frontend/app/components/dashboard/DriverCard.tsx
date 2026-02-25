import {Fragment} from 'react';
import type {Driver} from '~/domain/objects';
import {formatDriverName, formatPhoneNumber} from '~/util/format';
import Card from '../Card';
import {useLoader} from '~/util/query';
import {driverApi} from '~/api/endpoints/driver';
import {batchApi} from '~/api/endpoints/batch';

interface Props {
  driver: Driver;
}

export default function DriverCard({driver}: Props) {
  const assignedOrdersLoader = useLoader(async () => {
    const batch = await driverApi.getBatch(driver.id);
    if (!batch) {
      return [];
    }

    const orders = await batchApi.getOrders(batch.id);
    if (!orders) {
      throw new Error(`Failed to load orders for batch ${batch.id.id}`);
    }

    return orders;
  }, [driver.id.id]);

  let routeSummary = 'Loading route...';
  const assignedOrders = assignedOrdersLoader.response ?? [];
  const hasAssignedOrders =
    assignedOrdersLoader.loaded &&
    assignedOrdersLoader.response !== null &&
    assignedOrders.length > 0;

  if (assignedOrdersLoader.loaded) {
    if (assignedOrdersLoader.response === null) {
      routeSummary = 'Unavailable';
    } else if (assignedOrdersLoader.response.length === 0) {
      routeSummary = 'No assigned orders';
    }
  }

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
          {hasAssignedOrders ? (
            <span className="inline-flex flex-wrap items-center gap-2 align-middle">
              {assignedOrders.map((order, index) => {
                const markerColor =
                  order.state === 'delivered'
                    ? 'border-gray-300 bg-gray-200 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
                    : 'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';

                return (
                  <Fragment key={order.id.id}>
                    <span
                      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-xs font-semibold ${markerColor}`}
                    >
                      {order.id.id}
                    </span>
                    {index < assignedOrders.length - 1 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        →
                      </span>
                    )}
                  </Fragment>
                );
              })}
            </span>
          ) : (
            <span>{routeSummary}</span>
          )}
        </div>
      </Card>
    </>
  );
}
