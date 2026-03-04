import {Fragment, useContext, useEffect} from 'react';
import type {Driver} from '~/domain/objects';
import {driverApi} from '~/api/endpoints/driver';
import {batchApi} from '~/api/endpoints/batch';
import {useLoader} from '~/util/query';
import {OrderRefreshContext} from '../OrderRefreshProvider';

interface Props {
  driverId: Driver['id'];
}

export default function DriverRoute({driverId}: Props) {
  const monitor = useContext(OrderRefreshContext);

  const assignedOrdersLoader = useLoader(async () => {
    const batch = await driverApi.getBatch(driverId);
    if (!batch) {
      return [];
    }

    const orders = await batchApi.getOrders(batch.id);
    if (!orders) {
      throw new Error(`Failed to load orders for batch ${batch.id.id}`);
    }

    return orders;
  }, [driverId.id]);

  useEffect(() => {
    if (!monitor) return;

    const onOrderUpdate = () => {
      assignedOrdersLoader.reload();
    };

    monitor.addEventListener('orderUpdate', onOrderUpdate);
    return () => {
      monitor.removeEventListener('orderUpdate', onOrderUpdate);
    };
  }, [monitor, assignedOrdersLoader.reload]);

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

  if (!hasAssignedOrders) {
    return <span>{routeSummary}</span>;
  }

  return (
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
  );
}
