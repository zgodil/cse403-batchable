import {createContext, useContext, useEffect, useState} from 'react';
import {getToken} from '~/api/authToken';
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
  static forRestaurant(restaurant: Restaurant['id'], accessToken?: string) {
    const tokenQuery = accessToken
      ? `?access_token=${encodeURIComponent(accessToken)}`
      : '';
    return new RefreshMonitor(`${restaurant.id}${tokenQuery}`);
  }
  static forDriver(token: string) {
    return new RefreshMonitor(`token/${token}`);
  }
}

export const OrderRefreshContext = createContext<RefreshMonitor | null>(null);

interface Props {
  useDriverToken?: boolean;
}

/**
 * Provides an EventTarget to which any component can attach via useEffect.
 * It emits an event whenever orders or batches have changed.
 */
export default function OrderRefreshProvider({
  useDriverToken = false,
  children,
}: React.PropsWithChildren<Props>) {
  const restaurantId = useContext(RestaurantContext);
  const driverToken = useContext(DriverTokenContext);
  const [monitor, setMonitor] = useState<RefreshMonitor | null>(null);

  useEffect(() => {
    if (useDriverToken) {
      const newMonitor = driverToken ? RefreshMonitor.forDriver(driverToken) : null;
      setMonitor(newMonitor);
      return () => newMonitor?.close();
    }

    if (!restaurantId) {
      setMonitor(null);
      return;
    }

    let closed = false;
    let newMonitor: RefreshMonitor | null = null;

    void (async () => {
      const token = await getToken();
      if (closed || !token) return;

      newMonitor = RefreshMonitor.forRestaurant(restaurantId, token);
      setMonitor(newMonitor);
    })();

    return () => {
      closed = true;
      newMonitor?.close();
    };
  }, [driverToken, restaurantId, useDriverToken]);

  return <OrderRefreshContext value={monitor}>{children}</OrderRefreshContext>;
}
