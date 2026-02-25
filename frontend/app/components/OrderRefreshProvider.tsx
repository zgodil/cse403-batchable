import {createContext, useContext, useEffect, useState} from 'react';
import {getToken} from '~/api/authToken';
import {RestaurantContext} from './RestaurantProvider';
import type {Restaurant} from '~/domain/objects';

class RefreshMonitor extends EventTarget {
  private eventSource: EventSource;

  constructor(restaurant: Restaurant['id'], accessToken: string) {
    super();
    const url = `/sse/orders/${restaurant.id}?access_token=${encodeURIComponent(accessToken)}`;
    this.eventSource = new EventSource(url);
    this.eventSource.addEventListener('refresh', () => {
      this.dispatchEvent(new Event('orderUpdate'));
    });
  }
  close() {
    this.eventSource.close();
  }
}

export const OrderRefreshContext = createContext<RefreshMonitor | null>(null);

/**
 * Provides an EventTarget to which any component can attach via useEffect.
 * It emits an event whenever orders or batches have changed.
 */
export default function OrderRefreshProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {restaurant} = useContext(RestaurantContext);
  const [monitor, setMonitor] = useState<RefreshMonitor | null>(null);

  useEffect(() => {
    if (!restaurant) return;
    let closed = false;
    getToken().then(token => {
      if (closed || !restaurant || !token) return;
      const newMonitor = new RefreshMonitor(restaurant.id, token);
      setMonitor(newMonitor);
    });
    return () => {
      closed = true;
      setMonitor(m => {
        m?.close();
        return null;
      });
    };
  }, [restaurant]);

  return <OrderRefreshContext value={monitor}>{children}</OrderRefreshContext>;
}
