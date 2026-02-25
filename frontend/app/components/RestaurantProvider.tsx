import {createContext, useCallback, useEffect, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {getToken} from '~/api/authToken';
import {restaurantApi} from '~/api/endpoints/restaurant';
import type {Restaurant} from '~/domain/objects';

export type RestaurantContextValue = {
  restaurant: Restaurant | null;
  refreshRestaurant: () => Promise<void>;
};

export const RestaurantContext = createContext<RestaurantContextValue>({
  restaurant: null,
  refreshRestaurant: async () => {},
});

/**
 * Provides the current user's restaurant (from GET /api/restaurant/me) and a refresh callback.
 */
export default function RestaurantProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {isAuthenticated} = useAuth0();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const refreshRestaurant = useCallback(async () => {
    const r = await restaurantApi.getMyRestaurant();
    setRestaurant(r ?? null);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setRestaurant(null);
      return;
    }
    let cancelled = false;
    const load = async (tokenRetries = 25) => {
      const token = await getToken();
      if (cancelled) return;
      if (!token) {
        if (tokenRetries > 0) {
          setTimeout(() => load(tokenRetries - 1), 400);
        } else {
          // Auth may still be initializing after redirect; try once more after a delay
          setTimeout(() => {
            if (!cancelled) load(15);
          }, 2000);
        }
        return;
      }
      restaurantApi
        .getMyRestaurant()
        .then(r => {
          if (!cancelled) setRestaurant(r ?? null);
        })
        .catch(err => {
          if (cancelled) return;
          const is401 =
            String(err?.message || err).includes('401') ||
            String(err?.message || err).toLowerCase().includes('unauthorized');
          if (is401) setTimeout(() => load(10), 800);
        });
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <RestaurantContext.Provider value={{restaurant, refreshRestaurant}}>
      {children}
    </RestaurantContext.Provider>
  );
}
