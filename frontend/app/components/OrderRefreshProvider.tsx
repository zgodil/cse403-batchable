import {createContext, useContext, useEffect, useState} from 'react';
import {RestaurantContext} from './RestaurantProvider';
import type {Restaurant} from '~/domain/objects';
import {DriverTokenContext} from './DriverTokenContext';

export class RefreshMonitor extends EventTarget {
  private eventSource: EventSource;

  private constructor(path: string) {
    super();
    this.eventSource = new EventSource(`/sse/orders/${path}`);
    this.eventSource.addEventListener('refresh', () => {
      this.dispatchEvent(new Event('orderUpdate'));
    });
  }
  close() {
    this.eventSource.close();
  }
  static forRestaurant(restaurant: Restaurant['id']) {
    return new RefreshMonitor(`${restaurant.id}`);
  }
  static forDriver(token: string) {
    return new RefreshMonitor(`token/${token}`);
  }
}

/**
 * Represents an EventTarget which monitors order and batch changes. This should not be used directly as a context tag, but rather via `useContext(OrderRefreshContext)` with `<OrderRefreshProvider>`.
 */
export const OrderRefreshContext = createContext<RefreshMonitor | null>(null);

interface Props {
  useDriverToken?: boolean;
}

/**
 * Provides an EventTarget to which any component can attach via useEffect.
 * It emits an event (`'orderUpdate'`) whenever orders or batches have changed.
 */
export default function OrderRefreshProvider({
  useDriverToken = false,
  children,
}: React.PropsWithChildren<Props>) {
  const restaurant = useContext(RestaurantContext);
  const driverToken = useContext(DriverTokenContext);
  const [monitor, setMonitor] = useState<RefreshMonitor | null>(null);

  // create a monitor associated with the current RestaurantContext, whenever it changes
  useEffect(() => {
    let newMonitor: RefreshMonitor | null = null;
    if (useDriverToken) {
      newMonitor = driverToken ? RefreshMonitor.forDriver(driverToken) : null;
    } else {
      newMonitor = restaurant ? RefreshMonitor.forRestaurant(restaurant) : null;
    }
    if (!newMonitor) return;
    setMonitor(newMonitor);
    return () => newMonitor?.close();
  }, [restaurant]);

  return <OrderRefreshContext value={monitor}>{children}</OrderRefreshContext>;
}
